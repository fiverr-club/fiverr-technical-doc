"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  GitBranch,
  Terminal,
  Activity,
  ExternalLink,
  CheckCircle2,
  Code2,
  Workflow,
  Box,
  Globe,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Search,
  Sparkles,
  Lock,
  FileCode2,
} from "lucide-react";

type TabId =
  | "overview"
  | "ddd"
  | "auth"
  | "microservices"
  | "saga"
  | "database"
  | "devops";

interface RepoInfo {
  id: number;
  name: string;
  port: string;
  tech: string;
  db: string;
  description: string;
  githubUrl: string;
  swaggerUrl?: string;
}

interface MicroserviceDetail {
  name: string;
  port: number;
  db: string;
  boundedContext: string;
  aggregates: string[];
  repositories: string[];
  portsOut: string[];
  useCases: string[];
  swaggerUrl: string;
  endpoints: {
    method: "GET" | "POST" | "PUT" | "PATCH";
    path: string;
    summary: string;
  }[];
}

const REPOSITORIES: RepoInfo[] = [
  {
    id: 1,
    name: "fiverr-web",
    port: "3000",
    tech: "Next.js 15, React 19, TypeScript, Tailwind CSS",
    db: "—",
    description:
      "Giao diện Marketplace chính: 3-Tier Gig Configurator, Escrow Checkout, Order Workspace, Seller Studio, Real-time Inbox & Live API Explorer.",
    githubUrl: "https://github.com/fiverr-club/fiverr-web",
  },
  {
    id: 2,
    name: "fiverr-technical-doc",
    port: "3001",
    tech: "Next.js 15, React 19, TypeScript, Markdown Suite",
    db: "—",
    description:
      "Cổng tài liệu kỹ thuật tương tác (Interactive Technical Documentation Portal) & Sổ tay giải thích toàn bộ công nghệ của fiverr-club.",
    githubUrl: "https://github.com/fiverr-club/fiverr-technical-doc",
  },
  {
    id: 3,
    name: "fiverr-api-gateway",
    port: "8080",
    tech: "Spring Cloud Gateway (WebFlux), Redis, JWT",
    db: "Redis (:6379)",
    description:
      "Cổng điều phối biên tập trung (Unified API Edge Router), xác thực JWT, giới hạn tần suất (Rate Limiting), Resilience4j Circuit Breaker & CORS.",
    githubUrl: "https://github.com/fiverr-club/fiverr-api-gateway",
    swaggerUrl: "http://localhost:8080/swagger-ui.html",
  },
  {
    id: 4,
    name: "fiverr-auth-service",
    port: "8081",
    tech: "Java 21, Spring Boot 3.3.4, DDD Hexagonal",
    db: "fiverr_auth",
    description:
      "Quản lý định danh (IAM), đăng ký, đăng nhập, mã hóa mật khẩu BCrypt, cấp phát JWT Access/Refresh Token, phân quyền RBAC (BUYER, SELLER).",
    githubUrl: "https://github.com/fiverr-club/fiverr-auth-service",
    swaggerUrl: "http://localhost:8081/swagger-ui/index.html",
  },
  {
    id: 5,
    name: "fiverr-user-service",
    port: "8082",
    tech: "Java 21, Spring Boot 3.3.4, DDD Hexagonal",
    db: "fiverr_user",
    description:
      "Hồ sơ Freelancer & Buyer, kỹ năng, ngôn ngữ, nâng cấp tài khoản lên Seller và đánh giá cấp bậc (NEW_SELLER, LEVEL_ONE, LEVEL_TWO, TOP_RATED).",
    githubUrl: "https://github.com/fiverr-club/fiverr-user-service",
    swaggerUrl: "http://localhost:8082/swagger-ui/index.html",
  },
  {
    id: 6,
    name: "fiverr-gig-service",
    port: "8083",
    tech: "Java 21, Spring Boot 3.3.4, PostgreSQL, Redis",
    db: "fiverr_gig",
    description:
      "Danh mục dịch vụ (Gig Catalog), cấu hình 3 gói giá (BASIC, STANDARD, PREMIUM), tìm kiếm từ khóa và lọc theo danh mục.",
    githubUrl: "https://github.com/fiverr-club/fiverr-gig-service",
    swaggerUrl: "http://localhost:8083/swagger-ui/index.html",
  },
  {
    id: 7,
    name: "fiverr-order-service",
    port: "8084",
    tech: "Java 21, Spring Boot 3.3.4, PostgreSQL, Kafka",
    db: "fiverr_order",
    description:
      "Máy trạng thái đơn hàng (IN_PROGRESS, DELIVERED, REVISION_REQUESTED, COMPLETED), quản lý bàn giao, lượt chỉnh sửa và tích hợp Escrow.",
    githubUrl: "https://github.com/fiverr-club/fiverr-order-service",
    swaggerUrl: "http://localhost:8084/swagger-ui/index.html",
  },
  {
    id: 8,
    name: "fiverr-payment-service",
    port: "8085",
    tech: "Java 21, Spring Boot 3.3.4, PostgreSQL, Kafka",
    db: "fiverr_payment",
    description:
      "Sổ cái ký quỹ (EscrowTransaction: HELD/RELEASED), tính phí nền tảng 20%, giải ngân 80% vào ví SellerWallet và xử lý rút tiền.",
    githubUrl: "https://github.com/fiverr-club/fiverr-payment-service",
    swaggerUrl: "http://localhost:8085/swagger-ui/index.html",
  },
  {
    id: 9,
    name: "fiverr-messaging-service",
    port: "8086",
    tech: "Java 21, Spring Boot 3.3.4, PostgreSQL, Redis",
    db: "fiverr_messaging",
    description:
      "Luồng hội thoại giữa Buyer & Seller (Conversation, ChatMessage) và gửi báo giá tùy chỉnh (CustomOfferPayload).",
    githubUrl: "https://github.com/fiverr-club/fiverr-messaging-service",
    swaggerUrl: "http://localhost:8086/swagger-ui/index.html",
  },
  {
    id: 10,
    name: "fiverr-review-service",
    port: "8087",
    tech: "Java 21, Spring Boot 3.3.4, PostgreSQL, Kafka",
    db: "fiverr_review",
    description:
      "Đánh giá xác thực sau đơn hàng theo 3 tiêu chí (Communication, Service as Described, Recommend) và phản hồi của Seller.",
    githubUrl: "https://github.com/fiverr-club/fiverr-review-service",
    swaggerUrl: "http://localhost:8087/swagger-ui/index.html",
  },
  {
    id: 11,
    name: "fiverr-notification-service",
    port: "8088",
    tech: "Java 21, Spring Boot 3.3.4, PostgreSQL, Kafka",
    db: "fiverr_notification",
    description:
      "Lắng nghe sự kiện từ Apache Kafka và phân phối thông báo đa kênh (IN_APP, EMAIL, ALL) cho người dùng.",
    githubUrl: "https://github.com/fiverr-club/fiverr-notification-service",
    swaggerUrl: "http://localhost:8088/swagger-ui/index.html",
  },
  {
    id: 12,
    name: "fiverr-k8s-infra",
    port: "Infra",
    tech: "Docker Compose, Kubernetes, Kustomize, Helm v3",
    db: "8 PG Schemas",
    description:
      "Toàn bộ hạ tầng Container & Cloud: docker-compose.yml, init-postgres.sql, K8s StatefulSets/Deployments/HPA/Ingress, và Helm Umbrella Chart.",
    githubUrl: "https://github.com/fiverr-club/fiverr-k8s-infra",
  },
  {
    id: 13,
    name: ".github (org-profile)",
    port: "Org",
    tech: "Markdown, Mermaid Architecture Diagrams",
    db: "—",
    description:
      "Hồ sơ tổ chức chính thức trên GitHub (@fiverr-club) cùng quy chuẩn kiến trúc DDD & Hexagonal.",
    githubUrl: "https://github.com/fiverr-club/.github",
  },
];

const MICROSERVICES: MicroserviceDetail[] = [
  {
    name: "fiverr-api-gateway",
    port: 8080,
    db: "Redis 7.4 (:6379)",
    boundedContext: "Unified API Edge Routing, JWT Security, Rate Limiting & CORS",
    aggregates: ["RouteDefinition", "GatewayStatus"],
    repositories: ["(Stateless Reactive Edge Proxy)"],
    portsOut: ["RedisRateLimiter", "JwtAuthenticationFilter"],
    useCases: ["RouteForwarding", "EdgeRateLimiting", "GlobalCorsHandling"],
    swaggerUrl: "http://localhost:8080/swagger-ui.html",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/gateway/status",
        summary: "Kiểm tra trạng thái API Gateway và danh sách 8 tuyến microservice",
      },
    ],
  },
  {
    name: "fiverr-auth-service",
    port: 8081,
    db: "fiverr_auth (PostgreSQL 16)",
    boundedContext: "Identity & Access Management (IAM), BCrypt Credentials & JWT Tokens",
    aggregates: ["Account (Aggregate Root)", "Role (Enum)", "AccountStatus (Enum)"],
    repositories: ["domain/repository/AccountRepository.java"],
    portsOut: [
      "application/port/out/PasswordEncoderPort.java",
      "application/port/out/TokenProviderPort.java",
    ],
    useCases: [
      "RegisterAccountUseCase",
      "AuthenticateAccountUseCase",
      "RefreshTokenUseCase",
      "ChangePasswordUseCase",
      "GetAccountUseCase",
    ],
    swaggerUrl: "http://localhost:8081/swagger-ui/index.html",
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/auth/register",
        summary: "Đăng ký tài khoản mới (BUYER / SELLER)",
      },
      {
        method: "POST",
        path: "/api/v1/auth/login",
        summary: "Đăng nhập và nhận cặp JWT AccessToken & RefreshToken",
      },
      {
        method: "POST",
        path: "/api/v1/auth/refresh",
        summary: "Làm mới AccessToken từ RefreshToken",
      },
      {
        method: "GET",
        path: "/api/v1/auth/accounts",
        summary: "Lấy danh sách tài khoản định danh",
      },
      {
        method: "PUT",
        path: "/api/v1/auth/accounts/{id}/password",
        summary: "Đổi mật khẩu tài khoản",
      },
    ],
  },
  {
    name: "fiverr-user-service",
    port: 8082,
    db: "fiverr_user (PostgreSQL 16)",
    boundedContext: "Freelancer & Buyer Profiles, Skills, Languages & Seller Level Evaluation",
    aggregates: [
      "UserProfile (Aggregate Root)",
      "SellerLevel (NEW_SELLER, LEVEL_ONE, LEVEL_TWO, TOP_RATED)",
      "AvailabilityStatus",
    ],
    repositories: ["domain/repository/UserProfileRepository.java"],
    portsOut: [],
    useCases: [
      "CreateUserProfileUseCase",
      "UpdateUserProfileUseCase",
      "UpgradeToSellerUseCase",
      "GetUserProfileUseCase",
    ],
    swaggerUrl: "http://localhost:8082/swagger-ui/index.html",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/sellers",
        summary: "Lấy danh sách toàn bộ Freelancer / Seller",
      },
      {
        method: "GET",
        path: "/api/v1/profiles/{id}",
        summary: "Lấy chi tiết hồ sơ theo UUID",
      },
      {
        method: "GET",
        path: "/api/v1/users/{username}",
        summary: "Lấy chi tiết hồ sơ theo username",
      },
      {
        method: "POST",
        path: "/api/v1/profiles",
        summary: "Tạo hồ sơ người dùng mới",
      },
      {
        method: "PUT",
        path: "/api/v1/profiles/{id}",
        summary: "Cập nhật thông tin hồ sơ & kỹ năng",
      },
      {
        method: "POST",
        path: "/api/v1/profiles/{id}/upgrade-seller",
        summary: "Nâng cấp hồ sơ Buyer lên Seller chuyên nghiệp",
      },
    ],
  },
  {
    name: "fiverr-gig-service",
    port: 8083,
    db: "fiverr_gig (PostgreSQL 16 + Redis)",
    boundedContext: "Gig Catalog, 3-Tier Pricing Packages (Basic/Standard/Premium) & Search",
    aggregates: [
      "Gig (Aggregate Root)",
      "GigPackage (Value Object)",
      "PackageTier (BASIC, STANDARD, PREMIUM)",
    ],
    repositories: ["domain/repository/GigRepository.java"],
    portsOut: [],
    useCases: ["CreateGigUseCase", "GetGigUseCase", "SearchGigsUseCase"],
    swaggerUrl: "http://localhost:8083/swagger-ui/index.html",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/gigs",
        summary: "Lấy danh sách tất cả Gigs kèm 3 gói giá",
      },
      {
        method: "GET",
        path: "/api/v1/gigs/search",
        summary: "Tìm kiếm Gigs theo từ khóa và danh mục",
      },
      {
        method: "GET",
        path: "/api/v1/gigs/{id}",
        summary: "Xem chi tiết một Gig theo UUID",
      },
      {
        method: "POST",
        path: "/api/v1/gigs",
        summary: "Tạo Gig mới với cấu hình 3 gói BASIC, STANDARD, PREMIUM",
      },
    ],
  },
  {
    name: "fiverr-order-service",
    port: 8084,
    db: "fiverr_order (PostgreSQL 16 + Kafka)",
    boundedContext: "Order Lifecycle State Machine, Deliverables, Revisions & Escrow Coordination",
    aggregates: [
      "Order (Aggregate Root)",
      "OrderStatus (CREATED, IN_PROGRESS, DELIVERED, REVISION_REQUESTED, COMPLETED, CANCELLED)",
    ],
    repositories: ["domain/repository/OrderRepository.java"],
    portsOut: [
      "application/port/out/EscrowPaymentPort.java",
      "application/port/out/OrderEventPublisherPort.java",
    ],
    useCases: [
      "PlaceOrderUseCase",
      "DeliverOrderUseCase",
      "RequestRevisionUseCase",
      "CompleteOrderUseCase",
      "GetOrderUseCase",
    ],
    swaggerUrl: "http://localhost:8084/swagger-ui/index.html",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/orders",
        summary: "Lấy danh sách đơn hàng (lọc theo buyerId / sellerId)",
      },
      {
        method: "GET",
        path: "/api/v1/orders/{id}",
        summary: "Xem chi tiết đơn hàng theo UUID",
      },
      {
        method: "POST",
        path: "/api/v1/orders",
        summary: "Tạo đơn hàng mới & khóa tiền ký quỹ (IN_PROGRESS)",
      },
      {
        method: "POST",
        path: "/api/v1/orders/{id}/deliver",
        summary: "Seller nộp file bàn giao (DELIVERED)",
      },
      {
        method: "POST",
        path: "/api/v1/orders/{id}/revisions",
        summary: "Buyer yêu cầu chỉnh sửa sản phẩm (REVISION_REQUESTED)",
      },
      {
        method: "POST",
        path: "/api/v1/orders/{id}/complete",
        summary: "Buyer nghiệm thu đơn hàng & kích hoạt giải ngân (COMPLETED)",
      },
    ],
  },
  {
    name: "fiverr-payment-service",
    port: 8085,
    db: "fiverr_payment (PostgreSQL 16 + Kafka)",
    boundedContext: "Escrow Transaction Ledger (Hold/Release 80-20 Split) & Seller Wallets",
    aggregates: [
      "EscrowTransaction (Aggregate Root)",
      "SellerWallet (Aggregate Root)",
      "EscrowStatus (HELD, RELEASED, REFUNDED)",
    ],
    repositories: [
      "domain/repository/EscrowTransactionRepository.java",
      "domain/repository/SellerWalletRepository.java",
    ],
    portsOut: ["application/port/out/PaymentEventPublisherPort.java"],
    useCases: [
      "HoldEscrowUseCase",
      "ReleaseEscrowUseCase",
      "WithdrawSellerFundsUseCase",
      "GetPaymentLedgerUseCase",
    ],
    swaggerUrl: "http://localhost:8085/swagger-ui/index.html",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/payments/escrow",
        summary: "Xem toàn bộ sổ cái giao dịch ký quỹ (HELD / RELEASED)",
      },
      {
        method: "POST",
        path: "/api/v1/payments/escrow/hold",
        summary: "Khóa 100% tiền đơn hàng vào sổ cái ký quỹ (HELD)",
      },
      {
        method: "POST",
        path: "/api/v1/payments/escrow/release",
        summary: "Giải ngân 80% vào ví Seller & giữ 20% phí nền tảng (RELEASED)",
      },
      {
        method: "GET",
        path: "/api/v1/payments/wallets/{sellerId}",
        summary: "Xem số dư khả dụng và tổng tiền đã rút của Seller",
      },
      {
        method: "POST",
        path: "/api/v1/payments/wallets/withdraw",
        summary: "Rút tiền từ ví Seller về tài khoản thanh toán",
      },
    ],
  },
  {
    name: "fiverr-messaging-service",
    port: 8086,
    db: "fiverr_messaging (PostgreSQL 16 + Redis)",
    boundedContext: "Buyer-Seller Conversation Threads & Custom Milestone Offers",
    aggregates: [
      "Conversation (Aggregate Root)",
      "ChatMessage (Aggregate Root)",
      "CustomOfferPayload (Value Object)",
    ],
    repositories: [
      "domain/repository/ConversationRepository.java",
      "domain/repository/ChatMessageRepository.java",
    ],
    portsOut: ["application/port/out/MessageEventPublisherPort.java"],
    useCases: ["SendMessageUseCase", "GetConversationsUseCase"],
    swaggerUrl: "http://localhost:8086/swagger-ui/index.html",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/messages/conversations",
        summary: "Lấy danh sách các cuộc hội thoại",
      },
      {
        method: "GET",
        path: "/api/v1/messages/conversations/{conversationId}",
        summary: "Lấy lịch sử tin nhắn & Custom Offer trong hội thoại",
      },
      {
        method: "POST",
        path: "/api/v1/messages",
        summary: "Gửi tin nhắn mới hoặc gửi Custom Milestone Offer",
      },
    ],
  },
  {
    name: "fiverr-review-service",
    port: 8087,
    db: "fiverr_review (PostgreSQL 16 + Kafka)",
    boundedContext: "Verified 3-Criteria Buyer Reviews & Seller Public Responses",
    aggregates: ["Review (Aggregate Root)"],
    repositories: ["domain/repository/ReviewRepository.java"],
    portsOut: ["application/port/out/ReviewEventPublisherPort.java"],
    useCases: [
      "SubmitReviewUseCase",
      "AddSellerResponseUseCase",
      "GetReviewsUseCase",
    ],
    swaggerUrl: "http://localhost:8087/swagger-ui/index.html",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/reviews/gig/{gigId}",
        summary: "Lấy danh sách đánh giá xác thực của một Gig",
      },
      {
        method: "POST",
        path: "/api/v1/reviews",
        summary: "Gửi đánh giá 3 tiêu chí (Communication, Service, Recommend)",
      },
      {
        method: "POST",
        path: "/api/v1/reviews/{id}/seller-response",
        summary: "Seller gửi phản hồi dưới đánh giá của Buyer",
      },
    ],
  },
  {
    name: "fiverr-notification-service",
    port: 8088,
    db: "fiverr_notification (PostgreSQL 16 + Kafka)",
    boundedContext: "Multi-Channel Event-Driven Alerts (IN_APP, EMAIL, ALL)",
    aggregates: [
      "Notification (Aggregate Root)",
      "NotificationType",
      "NotificationChannel",
    ],
    repositories: ["domain/repository/NotificationRepository.java"],
    portsOut: ["application/port/out/NotificationSenderPort.java"],
    useCases: [
      "SendNotificationUseCase",
      "MarkNotificationReadUseCase",
      "GetUserNotificationsUseCase",
    ],
    swaggerUrl: "http://localhost:8088/swagger-ui/index.html",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/notifications/users/{userId}",
        summary: "Lấy danh sách thông báo của người dùng",
      },
      {
        method: "POST",
        path: "/api/v1/notifications",
        summary: "Tạo và gửi thông báo đa kênh mới",
      },
      {
        method: "PATCH",
        path: "/api/v1/notifications/{id}/read",
        summary: "Đánh dấu thông báo đã đọc (read = true)",
      },
    ],
  },
];

const SAGA_STEPS = [
  {
    step: 1,
    title: "Buyer Đặt Hàng (Place Order)",
    service: "fiverr-order-service (:8084)",
    topic: "order.events (OrderPlacedEvent)",
    status: "CREATED -> IN_PROGRESS",
    description:
      "Buyer chọn gói dịch vụ (Basic / Standard / Premium) trên fiverr-web và gửi POST /api/v1/orders. PlaceOrderUseCaseImpl khởi tạo Aggregate Root Order và kiểm tra các bất biến nghiệp vụ.",
    payload: `{
  "eventType": "ORDER_PLACED",
  "orderId": "44444444-4444-4444-4444-444444444444",
  "gigId": "11111111-1111-1111-1111-111111111111",
  "buyerId": "33333333-3333-3333-3333-333333333333",
  "sellerId": "11111111-1111-1111-1111-111111111111",
  "packageTier": "PREMIUM",
  "amount": 995.00
}`,
  },
  {
    step: 2,
    title: "Khóa Tiền Ký Quỹ 100% (Hold Escrow Funds)",
    service: "fiverr-payment-service (:8085)",
    topic: "payment.events (EscrowHeldEvent)",
    status: "EscrowStatus = HELD",
    description:
      "HoldEscrowUseCaseImpl khóa 100% giá trị đơn hàng vào bảng escrow_transactions với trạng thái HELD. Tính sẵn 20% phí nền tảng ($199.00) và 80% thực nhận của Seller ($796.00).",
    payload: `{
  "eventType": "ESCROW_HELD",
  "escrowId": "55555555-5555-5555-5555-555555555555",
  "orderId": "44444444-4444-4444-4444-444444444444",
  "grossAmount": 995.00,
  "platformFee": 199.00,
  "sellerNetPayout": 796.00,
  "gatewayChargeId": "ch_fvx_44444444",
  "status": "HELD"
}`,
  },
  {
    step: 3,
    title: "Seller Nộp Sản Phẩm Bàn Giao (Deliver Order)",
    service: "fiverr-order-service (:8084)",
    topic: "order.events (OrderDeliveredEvent)",
    status: "IN_PROGRESS -> DELIVERED",
    description:
      "Sau khi hoàn thành công việc, Seller gửi POST /api/v1/orders/{id}/deliver kèm link mã nguồn/tài liệu. Order chuyển sang trạng thái DELIVERED và thông báo cho Buyer nghiệm thu.",
    payload: `{
  "eventType": "ORDER_DELIVERED",
  "orderId": "44444444-4444-4444-4444-444444444444",
  "sellerId": "11111111-1111-1111-1111-111111111111",
  "deliverableUrl": "https://github.com/fiverr-club/deliverables-v1.zip",
  "deliveryNote": "Full 9 DDD microservices & Helm chart delivered.",
  "status": "DELIVERED"
}`,
  },
  {
    step: 4,
    title: "Buyer Nghiệm Thu & Hoàn Tất (Approve & Complete)",
    service: "fiverr-order-service (:8084)",
    topic: "order.events (OrderCompletedEvent)",
    status: "DELIVERED -> COMPLETED",
    description:
      "Buyer kiểm tra sản phẩm bàn giao và bấm 'Approve & Release Escrow' (POST /api/v1/orders/{id}/complete). Đơn hàng chuyển sang trạng thái COMPLETED.",
    payload: `{
  "eventType": "ORDER_COMPLETED",
  "orderId": "44444444-4444-4444-4444-444444444444",
  "buyerId": "33333333-3333-3333-3333-333333333333",
  "completedAt": "2026-11-04T09:30:00Z",
  "status": "COMPLETED"
}`,
  },
  {
    step: 5,
    title: "Giải Ngân Ký Quỹ 80/20 (Release Escrow to Wallet)",
    service: "fiverr-payment-service (:8085)",
    topic: "payment.events (EscrowReleasedEvent)",
    status: "EscrowStatus = RELEASED",
    description:
      "ReleaseEscrowUseCaseImpl chuyển trạng thái bản ghi Escrow sang RELEASED và cộng trực tiếp 80% ($796.00) vào availableBalance trong ví SellerWallet của Seller.",
    payload: `{
  "eventType": "ESCROW_RELEASED",
  "orderId": "44444444-4444-4444-4444-444444444444",
  "sellerId": "11111111-1111-1111-1111-111111111111",
  "creditedToSellerWallet": 796.00,
  "platformRevenueRetained": 199.00,
  "newAvailableBalance": 1476.00
}`,
  },
  {
    step: 6,
    title: "Đánh Giá 3 Tiêu Chí & Thông Báo Đa Kênh",
    service: "fiverr-review-service (:8087) + notification (:8088)",
    topic: "review.events (ReviewSubmittedEvent)",
    status: "Verified 5.0★ Review",
    description:
      "Buyer đánh giá 3 tiêu chí (Communication, Service as Described, Recommend). Sự kiện Kafka đồng bộ điểm đánh giá sang fiverr-gig-service, fiverr-user-service và gửi thông báo cho Seller.",
    payload: `{
  "eventType": "REVIEW_SUBMITTED",
  "orderId": "44444444-4444-4444-4444-444444444444",
  "gigId": "11111111-1111-1111-1111-111111111111",
  "communicationRating": 5,
  "serviceAsDescribedRating": 5,
  "buyAgainRecommendRating": 5,
  "overallRating": 5.0
}`,
  },
];

export default function TechnicalDocumentationPortal() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedLayer, setSelectedLayer] = useState<
    "domain" | "application" | "infrastructure" | "presentation"
  >("domain");
  const [selectedService, setSelectedService] = useState<MicroserviceDetail>(
    MICROSERVICES[4] // fiverr-order-service by default
  );
  const [activeSagaStep, setActiveSagaStep] = useState<number>(1);
  const [apiSearch, setApiSearch] = useState<string>("");
  const [gatewayOnline, setGatewayOnline] = useState<boolean | null>(null);
  const [gatewayChecking, setGatewayChecking] = useState<boolean>(false);

  const checkGatewayHealth = async () => {
    setGatewayChecking(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      const res = await fetch("http://localhost:8080/api/v1/gateway/status", {
        signal: controller.signal,
      });
      clearTimeout(timer);
      setGatewayOnline(res.ok);
    } catch {
      setGatewayOnline(false);
    } finally {
      setGatewayChecking(false);
    }
  };

  useEffect(() => {
    checkGatewayHealth();
  }, []);

  const allEndpoints = MICROSERVICES.flatMap((svc) =>
    svc.endpoints.map((ep) => ({
      ...ep,
      serviceName: svc.name,
      port: svc.port,
      swaggerUrl: svc.swaggerUrl,
    }))
  );

  const filteredEndpoints = allEndpoints.filter(
    (ep) =>
      ep.path.toLowerCase().includes(apiSearch.toLowerCase()) ||
      ep.summary.toLowerCase().includes(apiSearch.toLowerCase()) ||
      ep.serviceName.toLowerCase().includes(apiSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  FIVERREX<span className="text-emerald-400">.</span>
                </span>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                  TECHNICAL DOCS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kiến trúc Toàn diện Hệ sinh thái Cloud-Native Freelance Marketplace (@fiverr-club)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={checkGatewayHealth}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${gatewayChecking ? "animate-spin text-emerald-400" : ""}`}
              />
              <span>API Gateway (:8080):</span>
              {gatewayOnline === null ? (
                <span className="text-slate-400">Checking...</span>
              ) : gatewayOnline ? (
                <span className="flex items-center gap-1 font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span className="text-amber-400 font-semibold">DOC MODE</span>
              )}
            </button>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              <span>Mở Marketplace (:3000)</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <a
              href="https://github.com/fiverr-club"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span>GitHub @fiverr-club</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1">
            {[
              {
                id: "overview" as TabId,
                label: "1. Tổng quan & 13 Repos",
                icon: Layers,
              },
              {
                id: "ddd" as TabId,
                label: "2. DDD & Hexagonal (4 Tầng)",
                icon: Code2,
              },
              {
                id: "auth" as TabId,
                label: "3. Cơ chế Authen & JWT Edge",
                icon: ShieldCheck,
              },
              {
                id: "microservices" as TabId,
                label: "4. 9 Microservices & 28 APIs",
                icon: Server,
              },
              {
                id: "saga" as TabId,
                label: "5. Kafka KRaft & Escrow Saga",
                icon: Workflow,
              },
              {
                id: "database" as TabId,
                label: "6. 8 PostgreSQL DBs & Redis",
                icon: Database,
              },
              {
                id: "devops" as TabId,
                label: "7. Next.js 15, Docker & K8s/Helm",
                icon: Box,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* KPI Banner */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              label: "GitHub Repositories",
              value: "13 Repos",
              sub: "github.com/fiverr-club",
              color: "text-emerald-400",
            },
            {
              label: "Spring Boot Services",
              value: "9 Services",
              sub: "Java 21 LTS (:8080–:8088)",
              color: "text-sky-400",
            },
            {
              label: "REST API Endpoints",
              value: "28+ APIs",
              sub: "OpenAPI 3.0 / Swagger UI",
              color: "text-violet-400",
            },
            {
              label: "PostgreSQL 16 DBs",
              value: "8 Schemas",
              sub: "Database-per-Service",
              color: "text-amber-400",
            },
            {
              label: "Event Streaming",
              value: "Kafka KRaft",
              sub: "4 Domain Event Topics",
              color: "text-rose-400",
            },
            {
              label: "Kiến trúc Cốt lõi",
              value: "DDD + Hexagonal",
              sub: "domain/repository/ chuẩn",
              color: "text-emerald-300",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
            >
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className={`mt-1 text-xl font-extrabold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & 13 REPOSITORIES */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    <Sparkles className="h-3.5 w-3.5" />
                    Tổng quan Kiến trúc Hệ sinh thái FIVERREX (fiverr-club)
                  </span>
                  <h1 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                    Enterprise Cloud-Native Freelance Services & Escrow Marketplace
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    <strong>FIVERREX</strong> là hệ thống sàn giao dịch dịch vụ Freelance và Ký quỹ tài chính (Escrow)
                    được thiết kế theo chuẩn Microservices phân tán. Toàn bộ 8 dịch vụ nghiệp vụ phía sau{" "}
                    <code className="rounded bg-slate-800 px-1.5 py-0.5 text-emerald-300">
                      fiverr-api-gateway (:8080)
                    </code>{" "}
                    đều được viết bằng <strong>Java 21 + Spring Boot 3.3.4</strong>, áp dụng nghiêm ngặt{" "}
                    <strong>Domain-Driven Design (DDD)</strong> và{" "}
                    <strong>Hexagonal Architecture (Ports and Adapters)</strong>.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
                  <p className="font-bold text-emerald-400 mb-2">
                    Bộ 8 Tài liệu Markdown trong repo này (`docs/`):
                  </p>
                  <ul className="space-y-1.5 text-slate-300 font-mono">
                    <li>• docs/01-system-architecture.md</li>
                    <li>• docs/02-ddd-hexagonal-architecture.md</li>
                    <li>• docs/03-microservices-deep-dive.md</li>
                    <li>• docs/04-database-and-caching.md</li>
                    <li>• docs/05-event-driven-kafka-saga.md</li>
                    <li>• docs/06-frontend-architecture.md</li>
                    <li>• docs/07-devops-docker-kubernetes.md</li>
                    <li>• docs/08-authentication-and-security.md</li>
                  </ul>
                </div>
              </div>

              {/* Interactive System Data Flow Diagram */}
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Luồng Đi Của Request & Sự Kiện Trong Hệ Thống (End-to-End Architecture Flow)
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                      <Globe className="h-4 w-4" />
                      <span>1. Client Tier (:3000 / :3001)</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      <strong>fiverr-web</strong> (Next.js 15 + React 19) giao tiếp qua{" "}
                      <code className="text-sky-300">src/lib/api.ts</code> với cơ chế{" "}
                      <em>Resilient Dual-Mode Fallback</em>.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      <span>2. API Gateway (:8080)</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      <strong>Spring Cloud Gateway (WebFlux)</strong> xác thực JWT, kiểm tra Redis Rate Limit, xử lý CORS và định tuyến{" "}
                      <code className="text-emerald-300">/api/v1/**</code>.
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-4">
                    <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
                      <Cpu className="h-4 w-4" />
                      <span>3. 8 DDD Services (:8081–:8088)</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      Xử lý nghiệp vụ qua 4 tầng chuẩn: <strong>Presentation → Application → Domain ← Infrastructure</strong>.
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Database className="h-4 w-4" />
                      <span>4. Data & Event Mesh</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      <strong>PostgreSQL 16</strong> (8 DB riêng biệt), <strong>Redis 7.4</strong> (:6379) &{" "}
                      <strong>Apache Kafka 3.8 KRaft</strong> (:9092).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 13 Repositories Catalog */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Bảng Tổng Hợp 13 Repositories Trong Hệ Sinh Thái `fiverr-club`
                  </h2>
                  <p className="text-xs text-slate-400">
                    Mỗi repository đảm nhiệm một trách nhiệm độc lập và có thể triển khai riêng biệt trên Docker / Kubernetes.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Repository</th>
                      <th className="py-3 px-3">Port</th>
                      <th className="py-3 px-3">Tech Stack</th>
                      <th className="py-3 px-3">Database</th>
                      <th className="py-3 px-3">Trách nhiệm Nghiệp vụ (Bounded Context)</th>
                      <th className="py-3 px-3">Liên kết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {REPOSITORIES.map((repo) => (
                      <tr
                        key={repo.id}
                        className="hover:bg-slate-800/40 transition"
                      >
                        <td className="py-3 px-3 font-mono text-slate-500">
                          {repo.id}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                          {repo.name}
                        </td>
                        <td className="py-3 px-3 font-mono text-sky-300">
                          :{repo.port}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{repo.tech}</td>
                        <td className="py-3 px-3 font-mono text-amber-300">
                          {repo.db}
                        </td>
                        <td className="py-3 px-3 text-slate-300 max-w-md">
                          {repo.description}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={repo.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-700"
                            >
                              <span>GitHub</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            {repo.swaggerUrl && (
                              <a
                                href={repo.swaggerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/30"
                              >
                                <span>Swagger</span>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DDD & HEXAGONAL ARCHITECTURE */}
        {activeTab === "ddd" && (
          <div className="space-y-8">
            {/* Golden Rule Callout */}
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/20 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <span className="rounded bg-emerald-500 px-2 py-0.5 text-[11px] font-extrabold uppercase text-slate-950">
                    Quy Tắc Kiến Trúc Bắt Buộc Số 1
                  </span>
                  <h2 className="mt-2 text-xl font-extrabold text-white">
                    Tại sao `Repository Interface` LUÔN LUÔN nằm ở `domain/repository/` mà KHÔNG BAO GIỜ đặt ở `application/port/out/`?
                  </h2>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Theo nguyên lý <strong>Domain-Driven Design (DDD)</strong>, <code>Repository</code> định nghĩa hợp đồng lưu trữ và truy xuất các{" "}
                    <strong>Aggregate Root</strong> của miền nghiệp vụ (ví dụ: <code>OrderRepository</code>,{" "}
                    <code>GigRepository</code>, <code>EscrowTransactionRepository</code>). Do đó nó là một phần cốt lõi của tầng{" "}
                    <code className="text-emerald-300">domain/repository/</code>. Ngược lại, tầng{" "}
                    <code className="text-amber-300">application/port/out/</code> <strong>chỉ dành riêng cho các dịch vụ ngoại vi</strong>{" "}
                    (như <code>EscrowPaymentPort</code>, <code>OrderEventPublisherPort</code> gửi Kafka, <code>PasswordEncoderPort</code>,{" "}
                    <code>TokenProviderPort</code>).
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive 4-Layer Explorer */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Chọn Tầng Kiến Trúc Để Xem Chi Tiết & Code Mẫu:
                </h3>

                {[
                  {
                    id: "domain" as const,
                    title: "1. Tầng Domain (domain/)",
                    subtitle: "Trái tim Nghiệp vụ — Pure Java 21, Không phụ thuộc Framework",
                    packages: [
                      "domain/model/ (Aggregate Roots, Entities, Value Objects)",
                      "domain/repository/ (✅ BẮT BUỘC: {Entity}Repository.java)",
                      "domain/service/ (Pure Domain Services)",
                      "domain/exception/ (Domain Exceptions)",
                    ],
                    badge: "CORE LAYER",
                  },
                  {
                    id: "application" as const,
                    title: "2. Tầng Application (application/)",
                    subtitle: "Điều phối Use Cases, Giao dịch (@Transactional) & Ports",
                    packages: [
                      "application/port/in/ ({Action}{Entity}UseCase.java)",
                      "application/port/out/ (CHỈ cho External Services: Kafka, JWT, Escrow)",
                      "application/usecase/ ({Action}{Entity}UseCaseImpl.java)",
                      "application/dto/command/ & application/dto/result/",
                    ],
                    badge: "USE CASES",
                  },
                  {
                    id: "infrastructure" as const,
                    title: "3. Tầng Infrastructure (infrastructure/)",
                    subtitle: "Triển khai JPA Repositories, Kafka Producers & Seed Data",
                    packages: [
                      "infrastructure/persistence/entity/ ({Entity}Entity.java)",
                      "infrastructure/persistence/repository/ (Jpa{Entity}Repository.java)",
                      "infrastructure/persistence/mapper/ (Entity <-> Domain Mapper)",
                      "infrastructure/adapter/ (Kafka / HTTP / BCrypt Adapters)",
                    ],
                    badge: "OUTBOUND ADAPTERS",
                  },
                  {
                    id: "presentation" as const,
                    title: "4. Tầng Presentation (presentation/rest/)",
                    subtitle: "REST Controllers, Jakarta Validation & OpenAPI Docs",
                    packages: [
                      "presentation/rest/{Entity}Controller.java",
                      "presentation/rest/request/ & response/",
                      "presentation/rest/mapper/ (Request -> Command, Result -> Response)",
                    ],
                    badge: "INBOUND ADAPTERS",
                  },
                ].map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedLayer === layer.id
                        ? "border-emerald-500 bg-emerald-950/30"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        {layer.title}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        {layer.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {layer.subtitle}
                    </p>
                    <ul className="mt-2.5 space-y-1 text-[11px] font-mono text-slate-300">
                      {layer.packages.map((pkg, idx) => (
                        <li key={idx}>• {pkg}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {/* Code Viewer */}
              <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="h-5 w-5 text-emerald-400" />
                    <span className="font-mono text-sm font-bold text-white">
                      {selectedLayer === "domain" &&
                        "fiverr-order-service/.../domain/repository/OrderRepository.java"}
                      {selectedLayer === "application" &&
                        "fiverr-order-service/.../application/usecase/PlaceOrderUseCaseImpl.java"}
                      {selectedLayer === "infrastructure" &&
                        "fiverr-order-service/.../infrastructure/persistence/repository/JpaOrderRepository.java"}
                      {selectedLayer === "presentation" &&
                        "fiverr-order-service/.../presentation/rest/OrderController.java"}
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                    Java 21 + Spring Boot 3.3.4
                  </span>
                </div>

                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-300">
                  {selectedLayer === "domain" &&
                    `// ✅ ĐÚNG CHUẨN DDD: Repository Interface nằm trong domain/repository/
package club.fiverr.order.domain.repository;

import club.fiverr.order.domain.model.Order;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository {

    Order save(Order order);

    Optional<Order> findById(UUID id);

    List<Order> findAll();

    List<Order> findByBuyerId(UUID buyerId);

    List<Order> findBySellerId(UUID sellerId);
}

// Aggregate Root Order.java (Pure Java, bảo vệ các Invariants nghiệp vụ):
public void requestRevision(String reason) {
    if (this.status != OrderStatus.DELIVERED) {
        throw new InvalidOrderStateException("Revision can only be requested for DELIVERED orders");
    }
    if (this.usedRevisions >= this.maxRevisions) {
        throw new InvalidOrderStateException("Maximum allowed revisions exceeded");
    }
    this.usedRevisions++;
    this.status = OrderStatus.REVISION_REQUESTED;
}`}
                  {selectedLayer === "application" &&
                    `// ✅ Use Case phối hợp Domain Repository (domain/repository)
//    và External Service Ports (application/port/out)
package club.fiverr.order.application.usecase;

@Service
public class PlaceOrderUseCaseImpl implements PlaceOrderUseCase {

    private final OrderRepository orderRepository;               // Từ domain/repository/
    private final EscrowPaymentPort escrowPaymentPort;           // Từ application/port/out/
    private final OrderEventPublisherPort orderEventPublisherPort; // Từ application/port/out/

    @Override
    @Transactional
    public OrderResult execute(PlaceOrderCommand command) {
        Order order = Order.createNew(
                command.gigId(),
                command.buyerId(),
                command.sellerId(),
                command.packageTier(),
                command.amount(),
                command.requirements(),
                command.maxRevisions()
        );

        // Khóa tiền ký quỹ qua Outbound Port
        String escrowRef = escrowPaymentPort.holdEscrowFunds(
                order.getId(),
                order.getBuyerId(),
                order.getSellerId(),
                order.getAmount()
        );
        order.startProgress(escrowRef);

        // Lưu Aggregate qua Domain Repository
        Order saved = orderRepository.save(order);

        // Phát sự kiện Kafka qua Outbound Port
        orderEventPublisherPort.publishOrderPlaced(saved);

        return OrderResultMapper.toResult(saved);
    }
}`}
                  {selectedLayer === "infrastructure" &&
                    `// ✅ Infrastructure Adapter triển khai Domain Repository Interface
package club.fiverr.order.infrastructure.persistence.repository;

import club.fiverr.order.domain.model.Order;
import club.fiverr.order.domain.repository.OrderRepository;
import club.fiverr.order.infrastructure.persistence.entity.OrderEntity;
import club.fiverr.order.infrastructure.persistence.mapper.OrderPersistenceMapper;
import org.springframework.stereotype.Repository;

@Repository
public class JpaOrderRepository implements OrderRepository {

    private final OrderJpaRepository jpaRepository; // Spring Data JPA
    private final OrderPersistenceMapper mapper;    // Entity <-> Domain

    public JpaOrderRepository(OrderJpaRepository jpaRepository, OrderPersistenceMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Order save(Order order) {
        OrderEntity saved = jpaRepository.save(mapper.toEntity(order));
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
}`}
                  {selectedLayer === "presentation" &&
                    `// ✅ REST Controller chỉ giao tiếp với Inbound Use Case Ports (application/port/in)
package club.fiverr.order.presentation.rest;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final PlaceOrderUseCase placeOrderUseCase;
    private final DeliverOrderUseCase deliverOrderUseCase;
    private final RequestRevisionUseCase requestRevisionUseCase;
    private final CompleteOrderUseCase completeOrderUseCase;
    private final GetOrderUseCase getOrderUseCase;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        var command = OrderRestMapper.toCommand(request);
        var result = placeOrderUseCase.execute(command);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(OrderRestMapper.toResponse(result));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<OrderResponse> completeOrder(
            @PathVariable UUID id,
            @Valid @RequestBody CompleteOrderRequest request
    ) {
        var result = completeOrderUseCase.execute(new CompleteOrderCommand(id, request.buyerId()));
        return ResponseEntity.ok(OrderRestMapper.toResponse(result));
    }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUTHENTICATION & JWT EDGE SECURITY */}
        {activeTab === "auth" && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Stateless JWT Edge Authentication & Identity Header Propagation</span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-white">
                Cơ Chế Xác Thực (Authen) & Phân Quyền Giữa Các Microservices
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Thay vì bắt cả 8 microservices nội bộ (<code>:8081</code>–<code>:8088</code>) phải cấu hình lặp lại bộ lọc giải mã JWT, hệ thống tách biệt nhiệm vụ{" "}
                <strong>Cấp phát định danh & Băm mật khẩu BCrypt(12)</strong> tại{" "}
                <code className="text-emerald-300">fiverr-auth-service (:8081)</code> và nhiệm vụ{" "}
                <strong>Kiểm tra chữ ký HMAC-SHA256 & Truyền Identity Headers</strong> tập trung tại biên{" "}
                <code className="text-sky-300">fiverr-api-gateway (:8080)</code>.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                  {
                    step: "Bước 1",
                    title: "Đăng nhập / Đăng ký (:8081)",
                    desc: "Client gửi POST /api/v1/auth/login. LoginAuthAccountUseCaseImpl kiểm tra mật khẩu qua BCryptPasswordEncoder(12) trên DB fiverr_auth.",
                    badge: "BCrypt (Strength 12)",
                  },
                  {
                    step: "Bước 2",
                    title: "Ký phát Cặp Token JWT",
                    desc: "JwtTokenAdapter ký số HMAC-SHA256 tạo Access Token (hạn 3600s / 1h) chứa sub, username, email, roles và Refresh Token (hạn 7 ngày).",
                    badge: "HMAC-SHA256 (256-bit)",
                  },
                  {
                    step: "Bước 3",
                    title: "Xác thực Biên tại Gateway (:8080)",
                    desc: "JwtAuthenticationGlobalFilter (Order = -100) chặn request, đọc Authorization: Bearer <token> và gọi JwtTokenValidator kiểm tra chữ ký + hạn dùng.",
                    badge: "Edge Security Filter",
                  },
                  {
                    step: "Bước 4",
                    title: "Identity Header Mutation",
                    desc: "Gateway tự động gắn 3 HTTP Headers nội bộ: X-User-Id, X-User-Email, X-User-Roles trước khi forward xuống các services :8082–:8088.",
                    badge: "Stateless Propagation",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {item.step}
                      </span>
                      <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Comparison: Auth Service vs API Gateway */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    fiverr-auth-service (:8081) — JwtTokenAdapter.java
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    Token Issuer
                  </span>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-300">
{`@Component
public class JwtTokenAdapter implements JwtTokenPort {

    @Override
    public String generateAccessToken(AuthAccount account) {
        Instant now = Instant.now();
        List<String> roleNames = account.getRoles().stream()
                .map(AccountRole::name)
                .toList();

        return Jwts.builder()
                .subject(account.getId().toString())
                .claim("username", account.getUsername())
                .claim("email", account.getEmail())
                .claim("roles", roleNames)
                .claim("type", "access")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(3600)))
                .signWith(secretKey) // HMAC-SHA256
                .compact();
    }
}`}
                </pre>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    fiverr-api-gateway (:8080) — JwtAuthenticationGlobalFilter.java
                  </span>
                  <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                    Edge Verifier & Header Mutator
                  </span>
                </div>
                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-sky-300">
{`@Component
public class JwtAuthenticationGlobalFilter implements GlobalFilter, Ordered {

    public static final String HEADER_USER_ID = "X-User-Id";
    public static final String HEADER_USER_EMAIL = "X-User-Email";
    public static final String HEADER_USER_ROLES = "X-User-Roles";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (isPublicPath(exchange.getRequest().getURI().getPath())) {
            return chain.filter(exchange);
        }
        // Validate Bearer token signature & expiration
        JwtClaimsPayload payload = jwtTokenValidator
                .validateAndExtract(token)
                .orElseThrow();

        // Propagate verified identity headers to downstream services
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header(HEADER_USER_ID, payload.userId())
                .header(HEADER_USER_EMAIL, payload.email())
                .header(HEADER_USER_ROLES, String.join(",", payload.roles()))
                .build();
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }
}`}
                </pre>
              </div>
            </div>

            {/* Seeded Accounts & Sandbox vs Strict Mode */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="text-base font-bold text-white">
                  3 Tài Khoản Định Danh Seeded Sẵn Trong PostgreSQL (`fiverr_auth`)
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Mật khẩu mặc định cho cả 3 tài khoản: <code className="text-emerald-300">Password123!</code> (Băm bằng BCrypt strength 12 trong <code>AuthDataInitializer.java</code>).
                </p>
                <div className="mt-4 space-y-2.5 text-xs">
                  {[
                    {
                      id: "11111111-1111-1111-1111-111111111111",
                      username: "alex_architect",
                      email: "alex.rivera@fiverr.club",
                      roles: "BUYER, SELLER",
                      desc: "Top Rated Principal Java & Cloud Architect",
                    },
                    {
                      id: "22222222-2222-2222-2222-222222222222",
                      username: "elena_ai",
                      email: "elena.rostova@fiverr.club",
                      roles: "BUYER, SELLER",
                      desc: "Level 2 AI & Next.js Full-Stack Specialist",
                    },
                    {
                      id: "33333333-3333-3333-3333-333333333333",
                      username: "jordan_taylor",
                      email: "jordan.taylor@fiverr.club",
                      roles: "BUYER, SELLER",
                      desc: "Active Buyer & Seller Session mặc định trên fiverr-web",
                    },
                  ].map((acc) => (
                    <div
                      key={acc.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3.5"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400">
                            {acc.username}
                          </span>
                          <span className="text-slate-400">({acc.email})</span>
                        </div>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                          UUID: {acc.id}
                        </p>
                      </div>
                      <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-300">
                        {acc.roles}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <h3 className="text-base font-bold text-white">
                  Chế độ Demo/Swagger Mở vs. Strict JWT Mode
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Mặc định trong <code>fiverr-api-gateway/src/main/resources/application.yml</code>, biến{" "}
                  <code>security.jwt.public-paths</code> được mở cho các đường dẫn <code>/api/v1/*</code> để hỗ trợ kiểm thử trực tiếp trên Swagger UI và trải nghiệm nhanh.
                </p>
                <p className="mt-3 text-xs font-semibold text-amber-300">
                  Cấu hình bật chế độ Strict JWT Production (bắt buộc Bearer Token):
                </p>
                <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3.5 font-mono text-[11px] text-amber-300">
{`security:
  jwt:
    secret: \${JWT_SECRET}
    public-paths: /api/v1/auth,/api/v1/gigs,/api/v1/categories,/api/v1/reviews,/actuator,/fallback`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 9 MICROSERVICES & 28 REST APIs */}
        {activeTab === "microservices" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left selector */}
              <div className="lg:col-span-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Chọn Microservice (:8080 – :8088):
                </h3>
                {MICROSERVICES.map((svc) => (
                  <button
                    key={svc.name}
                    onClick={() => setSelectedService(svc)}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      selectedService.name === svc.name
                        ? "border-emerald-500 bg-emerald-950/30 text-white"
                        : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-xs font-bold text-emerald-400">
                        {svc.name}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {svc.boundedContext}
                      </p>
                    </div>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-sky-300">
                      :{svc.port}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Microservice Deep Dive */}
              <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-mono text-xl font-extrabold text-white">
                        {selectedService.name}
                      </h2>
                      <span className="rounded-md bg-sky-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-sky-300">
                        Port :{selectedService.port}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      {selectedService.boundedContext}
                    </p>
                  </div>

                  <a
                    href={selectedService.swaggerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                  >
                    <span>Swagger UI (:{selectedService.port})</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs font-bold text-emerald-400">
                      Domain Aggregates & Models (`domain/model/`)
                    </p>
                    <ul className="mt-2 space-y-1 font-mono text-xs text-slate-300">
                      {selectedService.aggregates.map((ag, i) => (
                        <li key={i}>• {ag}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs font-bold text-amber-400">
                      Domain Repositories (`domain/repository/`)
                    </p>
                    <ul className="mt-2 space-y-1 font-mono text-xs text-slate-300">
                      {selectedService.repositories.map((rep, i) => (
                        <li key={i}>• {rep}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs font-bold text-sky-400">
                      Database: <span className="font-mono">{selectedService.db}</span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs font-bold text-violet-400">
                      Inbound Use Cases (`application/port/in/`)
                    </p>
                    <ul className="mt-2 space-y-1 font-mono text-xs text-slate-300">
                      {selectedService.useCases.map((uc, i) => (
                        <li key={i}>• {uc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs font-bold text-rose-400">
                      Outbound Service Ports (`application/port/out/`)
                    </p>
                    {selectedService.portsOut.length > 0 ? (
                      <ul className="mt-2 space-y-1 font-mono text-xs text-slate-300">
                        {selectedService.portsOut.map((po, i) => (
                          <li key={i}>• {po}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">
                        Không yêu cầu dịch vụ ngoại vi (chỉ dùng Domain Repository)
                      </p>
                    )}
                  </div>
                </div>

                {/* Endpoints of selected service */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    REST API Endpoints Của {selectedService.name}:
                  </h4>
                  <div className="space-y-2">
                    {selectedService.endpoints.map((ep, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded px-2 py-0.5 font-mono font-bold ${
                              ep.method === "GET"
                                ? "bg-sky-500/20 text-sky-300"
                                : ep.method === "POST"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {ep.method}
                          </span>
                          <code className="font-mono font-semibold text-white">
                            {ep.path}
                          </code>
                        </div>
                        <span className="text-slate-400">{ep.summary}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Full Searchable Catalog of All Endpoints */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Toàn Bộ Danh Mục REST API Endpoints Qua API Gateway (:8080)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Được kết nối 100% trong <code>fiverr-web/src/lib/api.ts</code>
                  </p>
                </div>
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={apiSearch}
                    onChange={(e) => setApiSearch(e.target.value)}
                    placeholder="Tìm kiếm API path, service..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {filteredEndpoints.map((ep, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/90 p-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            ep.method === "GET"
                              ? "bg-sky-500/20 text-sky-300"
                              : ep.method === "POST"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {ep.method}
                        </span>
                        <code className="font-mono font-bold text-slate-100 truncate">
                          {ep.path}
                        </code>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {ep.summary}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0 rounded bg-slate-900 px-2 py-1 font-mono text-[10px] text-emerald-400 border border-slate-800">
                      :{ep.port}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KAFKA EVENT-DRIVEN & ESCROW SAGA */}
        {activeTab === "saga" && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-extrabold text-white">
                Mô Phỏng Tương Tác Luồng Đặt Hàng & Ký Quỹ (6-Step Escrow Order Saga)
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Sử dụng <strong>Apache Kafka 3.8 (KRaft Mode — ZooKeeper-less)</strong> trên cổng <code>:9092</code> để điều phối bất đồng bộ giữa{" "}
                <code>fiverr-order-service</code>, <code>fiverr-payment-service</code>, <code>fiverr-review-service</code> và <code>fiverr-notification-service</code>.
              </p>

              {/* Step Buttons */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                {SAGA_STEPS.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveSagaStep(s.step)}
                    className={`rounded-xl border p-3.5 text-left transition ${
                      activeSagaStep === s.step
                        ? "border-emerald-500 bg-emerald-950/40"
                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                        Bước {s.step}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <p className="mt-2 font-bold text-xs text-white">
                      {s.title}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-sky-400">
                      {s.status}
                    </p>
                  </button>
                ))}
              </div>

              {/* Active Step Detail */}
              {SAGA_STEPS.filter((s) => s.step === activeSagaStep).map((s) => (
                <div
                  key={s.step}
                  className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 rounded-xl border border-emerald-500/30 bg-slate-950 p-6"
                >
                  <div className="lg:col-span-6 space-y-4">
                    <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                      <Activity className="h-3.5 w-3.5" />
                      Bước {s.step} / 6 — {s.status}
                    </span>
                    <h3 className="text-lg font-extrabold text-white">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {s.description}
                    </p>
                    <div className="space-y-2 rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Microservice xử lý:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {s.service}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Kafka Topic & Event:</span>
                        <span className="font-mono font-bold text-amber-300">
                          {s.topic}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <p className="mb-2 font-mono text-xs font-bold text-slate-400">
                      Kafka Event Payload / Ledger State JSON:
                    </p>
                    <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-emerald-300">
                      {s.payload}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE-PER-SERVICE & REDIS */}
        {activeTab === "database" && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-xl font-extrabold text-white">
                Chiến Lược Database-per-Service Trên PostgreSQL 16 (:5432) & Redis 7.4 (:6379)
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Mỗi microservice sở hữu một schema cơ sở dữ liệu độc lập hoàn toàn được khởi tạo tự động qua{" "}
                <code>fiverr-k8s-infra/scripts/init-postgres.sql</code>.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    db: "fiverr_auth",
                    svc: "fiverr-auth-service (:8081)",
                    tables: ["accounts", "account_roles"],
                    desc: "Lưu trữ định danh, password_hash (BCrypt), roles (BUYER, SELLER) và trạng thái xác thực.",
                  },
                  {
                    db: "fiverr_user",
                    svc: "fiverr-user-service (:8082)",
                    tables: ["user_profiles", "user_skills", "user_languages"],
                    desc: "Hồ sơ Freelancer, cấp bậc Seller (TOP_RATED, LEVEL_TWO...), hourly_rate và rating_average.",
                  },
                  {
                    db: "fiverr_gig",
                    svc: "fiverr-gig-service (:8083)",
                    tables: ["gigs", "gig_packages"],
                    desc: "Danh mục Gig và 3 gói cấu hình BASIC, STANDARD, PREMIUM (giá, số ngày giao, số lần sửa).",
                  },
                  {
                    db: "fiverr_order",
                    svc: "fiverr-order-service (:8084)",
                    tables: ["orders"],
                    desc: "Máy trạng thái đơn hàng, escrow_reference, deliverable_url, used_revisions / max_revisions.",
                  },
                  {
                    db: "fiverr_payment",
                    svc: "fiverr-payment-service (:8085)",
                    tables: ["escrow_transactions", "seller_wallets"],
                    desc: "Sổ cái ký quỹ (gross_amount 100%, platform_fee 20%, seller_net_payout 80%) & số dư ví Seller.",
                  },
                  {
                    db: "fiverr_messaging",
                    svc: "fiverr-messaging-service (:8086)",
                    tables: ["conversations", "chat_messages"],
                    desc: "Hội thoại thời gian thực giữa Buyer & Seller và dữ liệu nhúng CustomOfferPayload.",
                  },
                  {
                    db: "fiverr_review",
                    svc: "fiverr-review-service (:8087)",
                    tables: ["reviews"],
                    desc: "Đánh giá 3 tiêu chí với ràng buộc UNIQUE(order_id) đảm bảo 100% đánh giá xác thực.",
                  },
                  {
                    db: "fiverr_notification",
                    svc: "fiverr-notification-service (:8088)",
                    tables: ["notifications"],
                    desc: "Thông báo đa kênh (IN_APP, EMAIL, ALL) và trạng thái đã đọc (read, read_at).",
                  },
                ].map((item) => (
                  <div
                    key={item.db}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-extrabold text-amber-400">
                        {item.db}
                      </span>
                      <Database className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-emerald-400">
                      {item.svc}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tables.map((t) => (
                        <span
                          key={t}
                          className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-sky-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NEXT.JS 15, DOCKER & KUBERNETES / HELM */}
        {activeTab === "devops" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Terminal className="h-5 w-5" />
                  <h3 className="text-base text-white">
                    Kịch Bản Điều Phối Hợp Nhất (`./start.sh`)
                  </h3>
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  Khởi chạy toàn bộ 13 tiến trình hoặc triển khai lên Kubernetes chỉ với một câu lệnh duy nhất:
                </p>
                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-emerald-300">
                  {`# Tự động phát hiện Docker Compose hoặc chạy trực tiếp trên host
./start.sh

# Khởi chạy toàn bộ Postgres, Redis, Kafka, 9 Services & Web qua Docker
./start.sh docker

# Kiểm tra trạng thái sức khỏe (Health & Port) của toàn bộ hệ thống
./start.sh status

# Chạy Unit Test cho cả 9 Microservices + kiểm tra Next.js build
./start.sh test

# Triển khai lên cụm Kubernetes bằng Kustomize hoặc Helm v3
./start.sh k8s
./start.sh helm`}
                </pre>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                  <h3 className="text-base text-white">
                    Kubernetes & Helm v3 Umbrella Chart (`fiverr-k8s-infra`)
                  </h3>
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  Cấu trúc triển khai chuẩn Production với StatefulSets, HPA, PDB và Zero-Trust NetworkPolicies:
                </p>
                <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-sky-300">
                  {`# 1. Triển khai bằng Kustomize
kubectl apply -k fiverr-k8s-infra/k8s/

# 2. Triển khai bằng Helm v3 Umbrella Chart
helm upgrade --install fiverr-ecosystem \\
  ./fiverr-k8s-infra/helm/fiverr-ecosystem \\
  --namespace fiverr-club \\
  --create-namespace \\
  -f ./fiverr-k8s-infra/helm/fiverr-ecosystem/values-prod.yaml`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          FIVERREX. DOCS (`fiverr-technical-doc`) — Tài liệu Kỹ thuật & Kiến trúc Hệ sinh thái{" "}
          <a
            href="https://github.com/fiverr-club"
            className="text-emerald-400 hover:underline"
          >
            github.com/fiverr-club
          </a>
        </p>
      </footer>
    </div>
  );
}
