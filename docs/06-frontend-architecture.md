# 06. Kiến trúc Frontend Next.js 15 & Resilient Dual-Mode API Client (`06-frontend-architecture.md`)

Tài liệu này giải thích chi tiết kiến trúc của ứng dụng giao diện người dùng **`fiverr-web` (`:3000`)**, cách ứng dụng kết nối tới toàn bộ **28 REST API Endpoints** qua API Gateway (`:8080`), và cơ chế **Resilient Dual-Mode Fallback** giúp hệ thống hoạt động mượt mà trong mọi môi trường.

---

## 1. Công nghệ Cốt lõi của `fiverr-web`

- **Framework**: **Next.js 15.1.6 (App Router)** — Tận dụng cấu trúc định tuyến theo thư mục (`src/app/`), tối ưu hóa tải trang và hỗ trợ xuất bản `output: 'standalone'` cho Docker/Kubernetes lẫn Serverless trên Vercel.
- **UI Library**: **React 19.0.0** — Sử dụng các hooks quản lý trạng thái hiện đại, đồng bộ hóa phiên đăng nhập (`AuthSession`) theo thời gian thực giữa các component qua Custom DOM Event (`fiverrex-session-change`).
- **Ngôn ngữ**: **TypeScript 5.7 (Strict Mode)** — Định nghĩa kiểu dữ liệu chặt chẽ cho toàn bộ Domain DTOs (`Gig`, `PackageTier`, `Order`, `EscrowTransactionItem`, `SellerWalletItem`, `Conversation`, `ReviewItem`, `NotificationItem`).
- **Styling & Icons**: **Tailwind CSS 3.4** với bảng màu thương hiệu Fiverr Emerald (`#1dbf73`, `#19a463`, `#0a4226`) kết hợp bộ biểu tượng **Lucide React**.

---

## 2. Cấu trúc Các Trang Nghiệp vụ (`src/app/`)

| Tuyến (Route) | File Nguồn | Chức năng Nghiệp vụ & Microservices Kết nối |
|---|---|---|
| `/` | `src/app/page.tsx` | **Marketplace Discovery Catalog**: Hero search, lọc theo 8 danh mục, lọc theo ngân sách, hiển thị danh sách Gigs từ `fiverr-gig-service` & tạo Gig mới. |
| `/gigs/[id]` | `src/app/gigs/[id]/page.tsx` | **Gig Detail & 3-Tier Configurator**: So sánh trực quan 3 gói `Basic`, `Standard`, `Premium`, tính phí dịch vụ 5.5%, bấm **Continue to Escrow Checkout** (`POST /api/v1/orders` + `POST /api/v1/payments/escrow/hold`), gửi đánh giá 3 tiêu chí (`POST /api/v1/reviews`). |
| `/orders` | `src/app/orders/page.tsx` | **Order & Escrow Workspace**: Quản lý vòng đời đơn hàng: Seller nộp bàn giao (`POST /api/v1/orders/{id}/deliver`), Buyer yêu cầu sửa đổi (`POST /api/v1/orders/{id}/revisions`), hoặc nghiệm thu & giải ngân ký quỹ (`POST /api/v1/orders/{id}/complete` + `POST /api/v1/payments/escrow/release`). |
| `/seller/dashboard` | `src/app/seller/dashboard/page.tsx` | **Seller Studio & Escrow Ledger**: Thống kê doanh thu đang chờ giải ngân (`HELD`), số dư khả dụng (`availableBalance`), rút tiền (`POST /api/v1/payments/wallets/withdraw`), đăng Gig mới (`POST /api/v1/gigs`), nâng cấp lên Seller (`POST /api/v1/profiles/{id}/upgrade-seller`). |
| `/messages` | `src/app/messages/page.tsx` | **Real-Time Inbox & Custom Offers**: Nhắn tin giữa Buyer và Seller (`GET/POST /api/v1/messages`), tạo báo giá tùy chỉnh (`CustomOffer`) và chấp nhận báo giá để khởi tạo đơn hàng Escrow. |

Ngoài ra, thanh điều hướng **`src/components/Navbar.tsx`** tích hợp:
- **Account Switcher & IAM Modal**: Chuyển đổi nhanh giữa 3 tài khoản mẫu (`Jordan Taylor`, `Alex Rivera`, `Elena Vance`) hoặc đăng nhập/đăng ký/đổi mật khẩu trực tiếp qua `fiverr-auth-service`.
- **Notification Bell Drawer**: Xem và đánh dấu đã đọc thông báo từ `fiverr-notification-service`.
- **Live Backend Status & 28-API Explorer Modal**: Cho phép kiểm tra trực tiếp trạng thái kết nối tới API Gateway `:8080` ngay trên giao diện.

---

## 3. Thiết kế `src/lib/api.ts`: Centralized API Client & DTO Normalizers

Toàn bộ giao tiếp mạng của `fiverr-web` được đóng gói tập trung trong `src/lib/api.ts` thông qua đối tượng `api` (kết nối mặc định tới `NEXT_PUBLIC_API_GATEWAY_URL = http://localhost:8080/api/v1`).

### 3.1. Cơ chế Resilient Dual-Mode Architecture (`fetchWithFallback`)

Một thách thức phổ biến của các dự án Microservices lớn là:
- Khi chạy **Local / Docker Compose / Kubernetes**, frontend kết nối trực tiếp tới `http://localhost:8080/api/v1` để đọc/ghi dữ liệu thật từ 8 cơ sở dữ liệu PostgreSQL.
- Khi người đánh giá truy cập bản demo **Vercel Cloud URL** (`https://fiverr-web-ochre.vercel.app`) từ trình duyệt của họ mà chưa bật cụm Docker ở máy cá nhân, kết nối tới `localhost:8080` sẽ không khả dụng.

Hàm `fetchWithFallback<T>` giải quyết triệt để bài toán này:

```typescript
async function fetchWithFallback<T>(
  endpoint: string,
  fallbackData: T,
  init?: RequestInit
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const session = getAuthSession();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(session.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    };

    const res = await fetch(`${API_GATEWAY_URL}${endpoint}`, {
      ...init,
      headers,
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!res.ok) return fallbackData;
    return (await res.json()) as T;
  } catch {
    return fallbackData;
  }
}
```

### 3.2. Bộ Chuẩn hóa DTO (Backend Spring Boot JSON -> Rich UI Models)

Các hàm `mapBackendGigToUi`, `mapBackendOrderToUi`, `mapBackendReviewToUi`, `mapBackendConversationToUi` tự động ánh xạ các bản ghi JSON trả về từ Spring Boot 3 (vốn sử dụng khóa UUID nghiêm ngặt như `11111111-1111-1111-1111-111111111111` và mảng `packages: [{ tier: "BASIC", ... }]`) thành cấu trúc giàu thông tin hiển thị trên giao diện React 19.
