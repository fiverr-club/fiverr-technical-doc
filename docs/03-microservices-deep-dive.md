# 03. Giải phẫu Chi tiết 9 Microservices & 28 REST APIs (`03-microservices-deep-dive.md`)

Tài liệu này phân tích chi tiết từng microservice trong hệ sinh thái **FIVERREX (`:8080`–`:8088`)**, bao gồm trách nhiệm nghiệp vụ, Domain Models, Use Cases, Database riêng biệt, và danh mục đầy đủ **28 REST API Endpoints**.

---

## 1. `fiverr-api-gateway` (Port `:8080`)
- **Công nghệ**: Spring Cloud Gateway (Reactive WebFlux), Redis Rate Limiter, Resilience4j, JWT Filter.
- **Trách nhiệm**: Cổng vào duy nhất cho toàn bộ client (`fiverr-web:3000`). Định tuyến toàn bộ lưu lượng `/api/v1/**` đến 8 microservices nghiệp vụ, kiểm tra JWT, cấu hình CORS và tổng hợp tài liệu OpenAPI.
- **Endpoints chính**:
  1. `GET /api/v1/gateway/status` — Kiểm tra trạng thái sức khỏe của API Gateway và danh sách các tuyến (routes) đang hoạt động.

---

## 2. `fiverr-auth-service` (Port `:8081` | DB: `fiverr_auth`)
- **Bounded Context**: Quản lý định danh, tài khoản, mật khẩu và cấp phát JWT Access/Refresh Token.
- **Domain Model (`domain/model/`)**:
  - `Account` (Aggregate Root): Quản lý `id`, `username`, `email`, `passwordHash`, `roles` (`Set<Role>`), `status` (`AccountStatus`), `emailVerified`, `lastLoginAt`.
  - `Role`: `BUYER`, `SELLER`, `ADMIN`.
  - `AccountStatus`: `ACTIVE`, `SUSPENDED`, `DEACTIVATED`.
- **Domain Repository**: `domain/repository/AccountRepository.java`
- **Outbound Ports (`application/port/out/`)**: `PasswordEncoderPort`, `TokenProviderPort`.
- **Use Cases (`application/port/in/`)**:
  - `RegisterAccountUseCase`, `AuthenticateAccountUseCase`, `RefreshTokenUseCase`, `ChangePasswordUseCase`, `GetAccountUseCase`.
- **REST API Endpoints (5 APIs)**:
  2. `POST /api/v1/auth/register` — Đăng ký tài khoản mới (`BUYER` / `SELLER`).
  3. `POST /api/v1/auth/login` — Đăng nhập bằng `usernameOrEmail` & `password`, nhận cặp JWT `accessToken` + `refreshToken`.
  4. `POST /api/v1/auth/refresh` — Làm mới Access Token từ Refresh Token.
  5. `GET /api/v1/auth/accounts` — Lấy danh sách tài khoản định danh đã khởi tạo.
  6. `PUT /api/v1/auth/accounts/{id}/password` — Đổi mật khẩu tài khoản (kiểm tra mật khẩu hiện tại qua `PasswordEncoderPort`).

---

## 3. `fiverr-user-service` (Port `:8082` | DB: `fiverr_user`)
- **Bounded Context**: Quản lý hồ sơ Freelancer & Buyer, kỹ năng, ngôn ngữ, đơn giá theo giờ và đánh giá cấp bậc Seller (`SellerLevel`).
- **Domain Model (`domain/model/`)**:
  - `UserProfile` (Aggregate Root): `id`, `accountId`, `username`, `displayName`, `headline`, `bio`, `avatarUrl`, `country`, `languages`, `skills`, `hourlyRate`, `isSeller`, `sellerLevel`, `availabilityStatus`, `completedOrdersCount`, `ratingAverage`.
  - `SellerLevel`: `NEW_SELLER`, `LEVEL_ONE`, `LEVEL_TWO`, `TOP_RATED`.
  - `AvailabilityStatus`: `AVAILABLE`, `BUSY`, `AWAY`.
- **Domain Repository**: `domain/repository/UserProfileRepository.java`
- **Use Cases (`application/port/in/`)**:
  - `CreateUserProfileUseCase`, `UpdateUserProfileUseCase`, `UpgradeToSellerUseCase`, `GetUserProfileUseCase`.
- **REST API Endpoints (6 APIs)**:
  7. `GET /api/v1/sellers` — Lấy danh sách tất cả các Freelancer/Seller đang hoạt động.
  8. `GET /api/v1/profiles/{id}` — Xem chi tiết hồ sơ theo `profileId` (UUID).
  9. `GET /api/v1/users/{username}` — Xem chi tiết hồ sơ theo `username`.
  10. `POST /api/v1/profiles` — Tạo hồ sơ người dùng mới.
  11. `PUT /api/v1/profiles/{id}` — Cập nhật thông tin hồ sơ, kỹ năng, trạng thái sẵn sàng.
  12. `POST /api/v1/profiles/{id}/upgrade-seller` — Nâng cấp tài khoản Buyer thành Seller chuyên nghiệp.

---

## 4. `fiverr-gig-service` (Port `:8083` | DB: `fiverr_gig`)
- **Bounded Context**: Danh mục dịch vụ (Gig Catalog), cấu trúc 3 gói dịch vụ (`BASIC`, `STANDARD`, `PREMIUM`), tìm kiếm từ khóa và phân loại danh mục.
- **Domain Model (`domain/model/`)**:
  - `Gig` (Aggregate Root): `id`, `sellerId`, `title` (bắt buộc chuẩn `"I will ..."`), `slug`, `category`, `description`, `status` (`GigStatus`), `packages` (`List<GigPackage>`), `averageRating`, `reviewsCount`.
  - `GigPackage` (Value Object): `tier` (`PackageTier`: `BASIC`, `STANDARD`, `PREMIUM`), `name`, `description`, `price`, `deliveryDays`, `revisions`.
- **Domain Repository**: `domain/repository/GigRepository.java`
- **Use Cases (`application/port/in/`)**:
  - `CreateGigUseCase`, `GetGigUseCase`, `SearchGigsUseCase`.
- **REST API Endpoints (4 APIs)**:
  13. `GET /api/v1/gigs` — Lấy toàn bộ danh sách Gigs kèm 3 gói giá `BASIC`, `STANDARD`, `PREMIUM`.
  14. `GET /api/v1/gigs/search?keyword=...&category=...` — Tìm kiếm và lọc Gigs theo từ khóa và danh mục.
  15. `GET /api/v1/gigs/{id}` — Lấy chi tiết một Gig theo UUID.
  16. `POST /api/v1/gigs` — Đăng một Gig mới với cấu hình 3 gói giá.

---

## 5. `fiverr-order-service` (Port `:8084` | DB: `fiverr_order`)
- **Bounded Context**: Quản lý vòng đời đơn hàng (Order State Machine), tích hợp khóa tiền ký quỹ và phát sự kiện đơn hàng lên Kafka.
- **Domain Model (`domain/model/`)**:
  - `Order` (Aggregate Root): `id`, `gigId`, `buyerId`, `sellerId`, `packageTier`, `amount`, `requirements`, `status` (`OrderStatus`), `escrowReference`, `deliverableUrl`, `deliveryNote`, `maxRevisions`, `usedRevisions`, `dueDate`.
  - `OrderStatus`: `CREATED` -> `IN_PROGRESS` -> `DELIVERED` -> `REVISION_REQUESTED` -> `COMPLETED` / `CANCELLED`.
- **Domain Repository**: `domain/repository/OrderRepository.java`
- **Outbound Ports (`application/port/out/`)**: `EscrowPaymentPort`, `OrderEventPublisherPort`.
- **Use Cases (`application/port/in/`)**:
  - `PlaceOrderUseCase`, `DeliverOrderUseCase`, `RequestRevisionUseCase`, `CompleteOrderUseCase`, `GetOrderUseCase`.
- **REST API Endpoints (6 APIs)**:
  17. `GET /api/v1/orders` — Lấy danh sách đơn hàng (hỗ trợ lọc theo `buyerId` hoặc `sellerId`).
  18. `GET /api/v1/orders/{id}` — Xem chi tiết đơn hàng, tiến độ bàn giao và mã tham chiếu Escrow.
  19. `POST /api/v1/orders` — Đặt đơn hàng mới (tự động khóa tiền ký quỹ và chuyển sang `IN_PROGRESS`).
  20. `POST /api/v1/orders/{id}/deliver` — Seller nộp sản phẩm bàn giao (`status -> DELIVERED`).
  21. `POST /api/v1/orders/{id}/revisions` — Buyer yêu cầu chỉnh sửa sản phẩm (`status -> REVISION_REQUESTED`).
  22. `POST /api/v1/orders/{id}/complete` — Buyer nghiệm thu đơn hàng (`status -> COMPLETED` & kích hoạt giải ngân Escrow).

---

## 6. `fiverr-payment-service` (Port `:8085` | DB: `fiverr_payment`)
- **Bounded Context**: Sổ cái ký quỹ (`EscrowTransaction`) và Ví doanh thu của Seller (`SellerWallet`).
- **Domain Model (`domain/model/`)**:
  - `EscrowTransaction` (Aggregate Root): `id`, `orderId`, `buyerId`, `sellerId`, `grossAmount` (100%), `platformFee` (20%), `sellerNetPayout` (80%), `gatewayChargeId`, `status` (`EscrowStatus`: `HELD`, `RELEASED`, `REFUNDED`).
  - `SellerWallet` (Aggregate Root): `sellerId`, `availableBalance`, `withdrawnTotal`.
- **Domain Repositories**: `domain/repository/EscrowTransactionRepository.java`, `domain/repository/SellerWalletRepository.java`.
- **Use Cases (`application/port/in/`)**:
  - `HoldEscrowUseCase`, `ReleaseEscrowUseCase`, `WithdrawSellerFundsUseCase`, `GetPaymentLedgerUseCase`.
- **REST API Endpoints (5 APIs)**:
  23. `GET /api/v1/payments/escrow` — Xem sổ cái tất cả giao dịch ký quỹ (`HELD` / `RELEASED`).
  24. `POST /api/v1/payments/escrow/hold` — Khóa tiền ký quỹ cho đơn hàng mới (`HELD`).
  25. `POST /api/v1/payments/escrow/release` — Giải ngân tiền ký quỹ khi đơn hàng hoàn tất (`RELEASED`: cộng 80% vào `SellerWallet`).
  26. `GET /api/v1/payments/wallets` (và `GET /api/v1/payments/wallets/{sellerId}`) — Xem số dư khả dụng và tổng tiền đã rút của Seller.
  27. `POST /api/v1/payments/wallets/withdraw` — Rút tiền từ số dư khả dụng của Seller về tài khoản ngân hàng / Stripe.

---

## 7. `fiverr-messaging-service` (Port `:8086` | DB: `fiverr_messaging`)
- **Bounded Context**: Hộp thư hội thoại thời gian thực giữa Buyer và Seller, đính kèm tệp và gửi Báo giá tùy chỉnh (`CustomOfferPayload`).
- **Domain Model (`domain/model/`)**:
  - `Conversation` (Aggregate Root): `id`, `buyerId`, `sellerId`, `gigId`, `lastMessagePreview`, `lastMessageAt`.
  - `ChatMessage` (Aggregate Root): `id`, `conversationId`, `senderId`, `recipientId`, `content`, `messageType` (`TEXT`, `CUSTOM_OFFER`, `DELIVERY_UPDATE`), `customOffer` (`CustomOfferPayload`).
- **Domain Repositories**: `domain/repository/ConversationRepository.java`, `domain/repository/ChatMessageRepository.java`.
- **REST API Endpoints (3 APIs)**:
  28. `GET /api/v1/messages/conversations` — Lấy danh sách các cuộc hội thoại của người dùng.
  29. `GET /api/v1/messages/conversations/{conversationId}` (và `GET /api/v1/messages`) — Lấy lịch sử tin nhắn và Custom Offers trong cuộc hội thoại.
  30. `POST /api/v1/messages` — Gửi tin nhắn văn bản hoặc gửi Custom Milestone Offer mới.

---

## 8. `fiverr-review-service` (Port `:8087` | DB: `fiverr_review`)
- **Bounded Context**: Hệ thống đánh giá xác thực 3 tiêu chí sau khi hoàn tất đơn hàng.
- **Domain Model (`domain/model/`)**:
  - `Review` (Aggregate Root): `id`, `orderId` (Unique), `gigId`, `buyerId`, `sellerId`, `communicationRating` (1–5), `serviceAsDescribedRating` (1–5), `buyAgainRecommendRating` (1–5), `overallRating` (trung bình cộng làm tròn 1 chữ số thập phân), `comment`, `sellerResponse`.
- **Domain Repository**: `domain/repository/ReviewRepository.java`
- **REST API Endpoints (3 APIs)**:
  31. `GET /api/v1/reviews` (và `GET /api/v1/reviews/gig/{gigId}`) — Lấy danh sách đánh giá xác thực của Gig.
  32. `POST /api/v1/reviews` — Buyer gửi đánh giá 3 tiêu chí cho đơn hàng.
  33. `POST /api/v1/reviews/{id}/seller-response` — Seller phản hồi công khai dưới đánh giá của Buyer.

---

## 9. `fiverr-notification-service` (Port `:8088` | DB: `fiverr_notification`)
- **Bounded Context**: Quản lý và phân phối thông báo đa kênh (`IN_APP`, `EMAIL`, `ALL`) dựa trên sự kiện.
- **Domain Model (`domain/model/`)**:
  - `Notification` (Aggregate Root): `id`, `recipientUserId`, `type` (`NotificationType`), `title`, `message`, `channel` (`NotificationChannel`), `read`, `readAt`, `createdAt`.
- **Domain Repository**: `domain/repository/NotificationRepository.java`
- **REST API Endpoints (3 APIs)**:
  34. `GET /api/v1/notifications` (và `GET /api/v1/notifications/users/{userId}`) — Lấy danh sách thông báo của người dùng.
  35. `POST /api/v1/notifications` — Tạo và phát thông báo đa kênh mới.
  36. `PATCH /api/v1/notifications/{id}/read` — Đánh dấu thông báo đã đọc (`read = true`, cập nhật `readAt`).
