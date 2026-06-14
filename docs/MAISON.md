# MAISON — Nền tảng Thiết kế Nội thất Tương tác Thời gian thực

> **Công ty**: Maison  
> **Công nghệ**: NestJS 11 + TypeORM + PostgreSQL / Next.js 16 + TailwindCSS  
> **Lưu trữ ảnh**: Cloudinary  
> **Email**: Nodemailer  
> **Ngôn ngữ**: Đa ngôn ngữ (bắt đầu từ Tiếng Việt)  
> **Git**: `https://github.com/namnguyen2908/Maison-design.git`

---

## Mục lục

- [1. Tổng quan dự án](#1-tổng-quan-dự-án)
- [2. Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
- [3. Quy trình nghiệp vụ](#3-quy-trình-nghiệp-vụ)
- [4. Database Schema](#4-database-schema)
- [5. API Design](#5-api-design)
- [6. Frontend — Client Portal](#6-frontend--client-portal)
- [7. Frontend — Maison Portal](#7-frontend--maison-portal)
- [8. Image Annotation Engine](#8-image-annotation-engine)
- [9. WebSocket Realtime](#9-websocket-realtime)
- [10. Authentication & Authorization](#10-authentication--authorization)
- [11. File Storage (Cloudinary)](#11-file-storage-cloudinary)
- [12. Multi-language (i18n)](#12-multi-language-i18n)
- [13. Email (Nodemailer)](#13-email-nodemailer)
- [14. Packages cần thêm](#14-packages-cần-thêm)
- [15. Roadmap phát triển](#15-roadmap-phát-triển)
- [16. Các vấn đề cần lưu ý](#16-các-vấn-đề-cần-lưu-ý)

---

## 1. Tổng quan dự án

### 1.1 Vấn đề

Hiện nay, quy trình thiết kế nội thất giữa công ty và khách hàng thường qua email/Zalo — mất thời gian, dễ hiểu lầm, không có lịch sử rõ ràng. Khách hàng muốn chỉnh sửa một chi tiết nhỏ (màu gạch, chất liệu tủ) phải mô tả bằng lời, dễ sai sót.

### 1.2 Giải pháp

Maison là nền tảng giúp:

- Công ty đăng tải bản thiết kế (ảnh) lên dự án của từng khách hàng
- Khách hàng **comment trực tiếp lên ảnh** tại vị trí cần sửa, kèm ảnh tham khảo
- Designer nhận thông báo realtime, sửa và upload phiên bản mới
- Toàn bộ lịch sử version + feedback được lưu vết
- Quy trình dự án được quản lý theo các giai đoạn (stage) rõ ràng

### 1.3 Kiến trúc tổng thể

```
┌──────────────────────────────────────────────────────────────┐
│                       Domain (TBD)                            │
├────────────────────────┬─────────────────────────────────────┤
│  client.maison.vn      │       noibo.maison.vn                │
│  (Next.js 16 :3001)    │       (Next.js 16 :3002)             │
│  → Cổng khách hàng     │       → Cổng công ty                 │
├────────────────────────┴─────────────────────────────────────┤
│               API Backend (NestJS :3000)                      │
│          REST API + WebSocket (Socket.io)                    │
├──────────────────────────────────────────────────────────────┤
│                    PostgreSQL (TypeORM)                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Kiến trúc hệ thống

### 2.1 Monorepo structure

```
E:\Maison/
├── .gitignore
│
├── docs/
│   └── MAISON.md              ← Tài liệu này
│
├── backend/                    ← NestJS API Server
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── common/             ← Guards, decorators, filters
│       ├── auth/               ← Module xác thực
│       ├── users/              ← Module người dùng
│       ├── projects/           ← Module dự án
│       ├── annotations/        ← Module annotation (cốt lõi)
│       ├── notifications/      ← Module thông báo
│       ├── upload/             ← Module upload file
│       ├── websocket/          ← Socket.io gateway
│       └── i18n/               ← Đa ngôn ngữ backend
│
├── client/                     ← Next.js 16 — Client Portal
│   ├── package.json
│   ├── .env                    ← PORT=3001
│   ├── next.config.ts
│   ├── proxy.ts                ← Auth proxy (thay middleware.ts)
│   └── src/
│       └── app/
│           ├── (auth)/
│           ├── (dashboard)/
│           └── ...
│
└── maison/                     ← Next.js 16 — Company Portal
    ├── package.json
    ├── .env                    ← PORT=3002
    ├── next.config.ts
    ├── proxy.ts
    └── src/
        └── app/
            ├── (auth)/
            ├── (dashboard)/
            └── ...
```

### 2.2 Technology Stack

| Layer | Công nghệ | Mục đích |
|-------|-----------|----------|
| **Backend** | NestJS 11 | REST API + WebSocket server |
| **Database** | PostgreSQL + TypeORM | Lưu dữ liệu |
| **Frontend (Client)** | Next.js 16 + TailwindCSS | Cổng khách hàng |
| **Frontend (Maison)** | Next.js 16 + TailwindCSS | Cổng công ty |
| **Realtime** | Socket.io | Thông báo realtime |
| **Ảnh** | Cloudinary | Upload + lưu trữ ảnh thiết kế |
| **Auth** | JWT (bcrypt) | Xác thực |
| **Email** | Nodemailer | Gửi email thông báo |
| **i18n** | next-intl | Đa ngôn ngữ |
| **Annotation** | Fabric.js | Vẽ marker + comment trên ảnh |

---

## 3. Quy trình nghiệp vụ

### 3.1 Luồng tổng thể dự án

```
TIẾP NHẬN              →     THIẾT KẾ               →     HOÀN THIỆN
────────────────             ──────────────────             ────────────
Khách gửi yêu cầu           Designer upload ảnh             Client duyệt cuối
    │                             │                              │
    v                             v                              v
Thu thập thông tin         Client xem + comment            Bàn giao
    │                             │
    v                             v
Gửi báo giá               Designer sửa + upload v2
    │                             │
    v                             v
Chốt hợp đồng             Client duyệt / comment tiếp
    │
    v
Giao cho Designer
```

### 3.2 Các giai đoạn (Stages)

Mỗi dự án có các stage linh hoạt (admin có thể thêm/bớt). Mặc định:

| Stage | Mô tả | Trạng thái |
|-------|-------|------------|
| **Khảo sát & Thu thập** | Client cung cấp: loại công trình, diện tích, phong cách, ngân sách, ảnh mặt bằng | `pending` → `completed` |
| **Chốt hợp đồng** | Gửi báo giá online, client duyệt | `pending` → `approved`/`rejected` |
| **Thiết kế — Phòng khách** | Thiết kế & phản hồi | `in_progress` → `completed` |
| **Thiết kế — Phòng ngủ** | Thiết kế & phản hồi | `in_progress` → `completed` |
| **Thiết kế — Phòng bếp** | Thiết kế & phản hồi | `in_progress` → `completed` |
| **Tổng hợp & Bàn giao** | File cuối, biên bản nghiệm thu | `pending` → `completed` |

### 3.3 Vòng lặp Design-Review (CỐT LÕI)

```
┌───────────────────────────────────────────────────────────────┐
│                    DESIGN REVIEW LOOP                          │
│                                                               │
│  1. Designer upload ảnh (version 1)                           │
│  2. Client mở ảnh, click vào vị trí cần sửa → thả marker     │
│  3. Client nhập comment + ảnh tham khảo (nếu có)             │
│  4. Designer nhận notification realtime                       │
│  5. Designer xem marker trên ảnh, đọc comment                 │
│  6. Designer upload version mới (ghi chú "đã sửa feedback #X")│
│  7. Client nhận notification, xem version mới                │
│  8. Client so sánh before/after → nếu ưng thì ✅ Duyệt       │
│  9. Nếu chưa → quay lại bước 2                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema

### 4.1 User

```typescript
@Entity('users')
export class User {
  id: string;               // UUID
  name: string;             // Họ tên (100)
  email: string;            // Email duy nhất (255)
  passwordHash: string;     // Bcrypt hash
  role: 'admin' | 'designer' | 'client';
  phone: string;            // (20) nullable
  avatarUrl: string;        // (500) nullable
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Project

```typescript
@Entity('projects')
export class Project {
  id: string;               // UUID
  name: string;             // Tên dự án (200)
  description: text;        // nullable
  address: string;          // (300) nullable
  status: 'pending' | 'in_progress' | 'reviewing' | 'completed' | 'cancelled';
  client: User;             // FK → users
  assignedDesigner: User;   // FK → users, nullable
  createdAt: Date;
  updatedAt: Date;
  stages: ProjectStage[];   // OneToMany
}
```

### 4.3 ProjectStage

```typescript
@Entity('project_stages')
export class ProjectStage {
  id: string;               // UUID
  project: Project;         // FK → projects
  name: string;             // "Khảo sát", "Thiết kế phòng khách", ...
  order: number;            // Thứ tự stage
  status: 'pending' | 'in_progress' | 'completed';
  checklist: JSON;          // [{ text: "Đã đo đạc", done: true }]
  createdAt: Date;
  rooms: Room[];            // OneToMany
}
```

### 4.4 Room

```typescript
@Entity('rooms')
export class Room {
  id: string;               // UUID
  stage: ProjectStage;      // FK → project_stages
  name: string;             // "Phòng khách", "Phòng ngủ master"
  status: 'pending' | 'in_review' | 'changes_requested' | 'approved';
  currentVersion: number;   // Version mới nhất
  createdAt: Date;
  versions: DesignVersion[];// OneToMany
}
```

### 4.5 DesignVersion

```typescript
@Entity('design_versions')
export class DesignVersion {
  id: string;               // UUID
  room: Room;               // FK → rooms
  versionNumber: number;    // 1, 2, 3...
  notes: text;              // "Đã sửa màu gạch theo feedback #3"
  uploadedBy: User;         // FK → users
  createdAt: Date;
  images: DesignImage[];    // OneToMany
  annotations: Annotation[];// OneToMany
}
```

### 4.6 DesignImage

```typescript
@Entity('design_images')
export class DesignImage {
  id: string;               // UUID
  version: DesignVersion;   // FK → design_versions
  url: string;              // Cloudinary URL (500)
  publicId: string;         // Cloudinary public_id (để xóa/update)
  originalName: string;     // Tên file gốc (50)
  width: number;
  height: number;
  sortOrder: number;        // Thứ tự hiển thị
}
```

### 4.7 Annotation (QUAN TRỌNG NHẤT)

```typescript
@Entity('annotations')
export class Annotation {
  id: string;               // UUID
  designVersion: DesignVersion; // FK → design_versions
  x: number;                // % tọa độ X (0-100)
  y: number;                // % tọa độ Y (0-100)
  targetImage: DesignImage; // FK → design_images (ảnh nào được comment)
  referenceImageUrl: string;// URL ảnh tham khảo (nullable)
  status: 'pending' | 'resolved' | 'reopened';
  createdBy: User;          // FK → users
  createdAt: Date;
  comments: Comment[];      // OneToMany
}
```

> **Tọa độ %**: Dùng phần trăm (0–100) thay vì pixel để ảnh hiển thị đúng trên mọi kích thước màn hình. Khi render: `pixelX = (percentX / 100) * imageDisplayWidth`.

### 4.8 Comment

```typescript
@Entity('comments')
export class Comment {
  id: string;               // UUID
  annotation: Annotation;   // FK → annotations
  user: User;               // FK → users
  content: text;
  createdAt: Date;
}
```

### 4.9 Notification

```typescript
@Entity('notifications')
export class Notification {
  id: string;               // UUID
  user: User;               // FK → users
  type: 'new_comment' | 'new_version' | 'status_change' | 'room_approved';
  message: text;
  relatedUrl: string;       // Link dẫn tới project/design tương ứng
  read: boolean;            // default false
  createdAt: Date;
}
```

---

## 5. API Design

### 5.1 Module structure (Backend)

```
src/
├── app.module.ts
├── main.ts
├── database/
│   └── typeorm.config.ts
├── common/
│   ├── guards/
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   └── filters/
│       └── http-exception.filter.ts
├── i18n/
│   ├── i18n.module.ts
│   ├── i18n.service.ts
│   └── locales/
│       ├── vi/
│       │   ├── auth.json
│       │   ├── project.json
│       │   ├── annotation.json
│       │   └── email.json
│       └── en/
│           ├── auth.json
│           ├── project.json
│           ├── annotation.json
│           └── email.json
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── entities/user.entity.ts
├── projects/
│   ├── projects.module.ts
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   ├── entities/
│   │   ├── project.entity.ts
│   │   ├── project-stage.entity.ts
│   │   ├── room.entity.ts
│   │   ├── design-version.entity.ts
│   │   └── design-image.entity.ts
│   └── dto/
│       ├── create-project.dto.ts
│       ├── update-project.dto.ts
│       ├── create-stage.dto.ts
│       ├── create-room.dto.ts
│       └── upload-design.dto.ts
├── annotations/
│   ├── annotations.module.ts
│   ├── annotations.controller.ts
│   ├── annotations.service.ts
│   ├── annotations.gateway.ts
│   ├── entities/
│   │   ├── annotation.entity.ts
│   │   └── comment.entity.ts
│   └── dto/
│       ├── create-annotation.dto.ts
│       └── create-comment.dto.ts
├── notifications/
│   ├── notifications.module.ts
│   ├── notifications.controller.ts
│   ├── notifications.service.ts
│   └── entities/notification.entity.ts
├── upload/
│   ├── upload.module.ts
│   ├── upload.controller.ts
│   ├── upload.service.ts
│   └── cloudinary.config.ts
├── email/
│   ├── email.module.ts
│   ├── email.service.ts
│   └── templates/
│       ├── new-comment.hbs
│       ├── new-version.hbs
│       └── project-completed.hbs
└── websocket/
    └── websocket.gateway.ts
```

### 5.2 REST API Endpoints

#### Auth
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký (admin tạo tài khoản) | Admin |
| POST | `/api/auth/login` | Đăng nhập → JWT | - |
| GET | `/api/auth/me` | Thông tin user hiện tại | All |

#### Users
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/users` | Danh sách users | Admin |
| GET | `/api/users/:id` | Chi tiết user | Admin |
| PATCH | `/api/users/:id` | Cập nhật user | Admin |
| DELETE | `/api/users/:id` | Xóa user | Admin |

#### Projects
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/projects` | Danh sách dự án (filter theo role) | All |
| POST | `/api/projects` | Tạo dự án mới | Admin/Designer |
| GET | `/api/projects/:id` | Chi tiết + stages + rooms | All (project members) |
| PATCH | `/api/projects/:id` | Cập nhật dự án | Admin/Designer |
| PATCH | `/api/projects/:id/status` | Đổi trạng thái | Admin |
| DELETE | `/api/projects/:id` | Xóa (soft) | Admin |

#### Stages
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/projects/:id/stages` | Thêm stage | Admin/Designer |
| PATCH | `/api/projects/:id/stages/:stageId` | Cập nhật stage | Admin/Designer |
| DELETE | `/api/projects/:id/stages/:stageId` | Xóa stage | Admin |

#### Rooms
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/projects/:id/stages/:stageId/rooms` | Thêm phòng | Admin/Designer |
| PATCH | `/api/stages/:stageId/rooms/:roomId` | Cập nhật phòng | Admin/Designer |
| DELETE | `/api/stages/:stageId/rooms/:roomId` | Xóa phòng | Admin |
| PATCH | `/api/rooms/:roomId/approve` | Client duyệt phòng | Client |

#### Designs
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/rooms/:roomId/designs` | Upload thiết kế (multipart) | Designer |
| GET | `/api/rooms/:roomId/designs` | Danh sách versions | All |
| GET | `/api/designs/:designId` | Chi tiết version (images) | All |
| GET | `/api/designs/:designId/images/:imageId` | View/download ảnh gốc | All |

#### Annotations (CORE)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/designs/:designId/annotations` | Lấy tất cả annotation | All |
| POST | `/api/designs/:designId/annotations` | Tạo annotation mới | All |
| PATCH | `/api/annotations/:id/status` | Resolve/reopen | Designer |
| POST | `/api/annotations/:id/comments` | Thêm comment | All |

#### Notifications
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/notifications` | Danh sách thông báo | All |
| PATCH | `/api/notifications/:id/read` | Đánh dấu đã đọc | All |
| PATCH | `/api/notifications/read-all` | Đánh dấu tất cả đã đọc | All |

#### Upload
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/upload/image` | Upload 1 ảnh → Cloudinary URL | Designer |

---

## 6. Frontend — Client Portal

### 6.1 Pages

```
client/src/app/
├── layout.tsx                     ← RootLayout + AuthProvider
├── page.tsx                        ← Redirect → /dashboard
├── globals.css
│
├── proxy.ts                       ← Auth guard (thay middleware.ts)
│
├── (auth)/
│   ├── login/page.tsx             ← Đăng nhập
│   └── register/page.tsx          ← Đăng ký (nếu cần)
│
├── (dashboard)/
│   ├── layout.tsx                 ← Sidebar + Header + NotificationBell
│   ├── page.tsx                   ← Dashboard: danh sách dự án
│   └── projects/
│       └── [projectId]/
│           ├── page.tsx           ← Tổng quan + timeline stages
│           └── rooms/
│               └── [roomId]/
│                   └── page.tsx   ← DESIGN REVIEW (ảnh + annotation)
│
└── notifications/
    └── page.tsx                   ← Lịch sử thông báo
```

### 6.2 Components

```
components/
├── layout/
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── notification-bell.tsx
│   └── language-switcher.tsx
├── project/
│   ├── project-card.tsx
│   ├── project-timeline.tsx       ← Timeline stages
│   ├── stage-progress.tsx
│   └── room-item.tsx
├── design/
│   ├── design-canvas.tsx          ← Fabric.js canvas
│   ├── annotation-marker.tsx      ← Marker pin trên ảnh
│   ├── annotation-popup.tsx       ← Popup comment
│   ├── annotation-sidebar.tsx     ← Danh sách comment bên phải
│   ├── version-history.tsx        ← Timeline các version
│   └── version-slider.tsx         ← Before/After slider
├── ui/
│   ├── button.tsx
│   ├── modal.tsx
│   ├── spinner.tsx
│   ├── empty-state.tsx
│   └── status-badge.tsx
└── shared/
    ├── image-uploader.tsx
    └── confirm-dialog.tsx
```

### 6.3 Màn hình Design Review (quan trọng nhất)

```
┌──────────────────────────────────────────────────────────────┐
│ [← Quay lại]  Phòng khách - Version 2/3     🌐 EN | 🇻🇳 VI  │
├──────────────────────────┬───────────────────────────────────┤
│                          │  📋 PHẢN HỒI                      │
│  ┌────────────────────┐  │                                   │
│  │                    │  │  🔴 #1 — Gạch nền                 │
│  │    ẢNH THIẾT KẾ    │  │     Bạn: "Đổi màu xám đen"       │
│  │                    │  │     📎 ảnh_mau.jpg                │
│  │       📍           │  │     Designer: "Đã sửa ở v2"      │
│  │      (marker)      │  │                                   │
│  │     click →        │  │  🟢 #2 — Màu tường              │
│  │   thêm comment     │  │     Bạn: "Sơn beige"             │
│  │                    │  │     → Đã duyệt ✓                 │
│  │                    │  │                                   │
│  └────────────────────┘  │                                   │
│                          │  [Thêm comment mới]               │
│  ───●──────── Version    │                                   │
│     Slider (Before/After)│                                   │
└──────────────────────────┴───────────────────────────────────┘
```

---

## 7. Frontend — Maison Portal

### 7.1 Pages

```
maison/src/app/
├── layout.tsx
├── page.tsx                         ← Redirect → /dashboard
├── proxy.ts                         ← Auth guard
│
├── (auth)/
│   └── login/page.tsx
│
├── (dashboard)/
│   ├── layout.tsx                   ← Sidebar (QL dự án, Nhân viên, ...)
│   ├── page.tsx                     ← Dashboard tổng quan (thống kê)
│   │
│   ├── projects/
│   │   ├── page.tsx                 ← DS dự án (filter: tất cả/đang TK/đã BG)
│   │   ├── new/page.tsx             ← Form tạo dự án + chọn client
│   │   └── [projectId]/
│   │       ├── page.tsx             ← Chi tiết + timeline
│   │       ├── settings/page.tsx    ← Cấu hình (gán designer)
│   │       ├── stages/
│   │       │   └── [stageId]/
│   │       │       └── page.tsx     ← Quản lý stage + checklist
│   │       └── rooms/
│   │           └── [roomId]/
│   │               └── page.tsx     ← Upload + feedback
│   │
│   ├── clients/
│   │   ├── page.tsx                 ← DS khách hàng
│   │   └── [clientId]/page.tsx      ← Chi tiết + dự án của khách
│   │
│   └── designers/
│       ├── page.tsx                 ← DS designer
│       └── [designerId]/page.tsx    ← Workload + dự án đang làm
│
└── notifications/
    └── page.tsx
```

### 7.2 Màn hình Upload Design

```
┌──────────────────────────────────────────────────────────────┐
│  Upload thiết kế: Phòng khách (Version 2)                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────┐        │
│  │                  🖼  Kéo thả ảnh                   │        │
│  │                    hoặc Click                     │        │
│  └──────────────────────────────────────────────────┘        │
│                                                              │
│  Ảnh đã chọn:                                                │
│  ┌────┐ ┌────┐ ┌────┐                                       │
│  │ P1 │ │ P2 │ │ P3 │                                       │
│  └────┘ └────┘ └────┘                                       │
│                                                              │
│  Ghi chú version:                                            │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ Đã cập nhật màu gạch theo feedback #3                │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
│               [Hủy]              [Tải lên]                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Image Annotation Engine

### 8.1 Công nghệ

Sử dụng **Fabric.js** — thư viện canvas manipulation mạnh mẽ, hỗ trợ đầy đủ sự kiện chuột, zoom, pan.

### 8.2 Luồng tương tác

```
1. Load ảnh lên Fabric.js canvas
2. Client click vào vị trí bất kỳ
   → Fabric event: mouse:down
   → Tính tọa độ %: (clickX / canvasWidth) * 100
   → Thả một Circle marker (màu đỏ) tại vị trí click
   → Mở popup: textarea + "Thêm ảnh tham khảo" + "Gửi"
3. Submit:
   → POST /api/designs/:id/annotations
   → Marker chuyển sang màu xanh (đã lưu)
   → Sidebar cập nhật danh sách comment
4. Designer load lại canvas:
   → GET /api/designs/:id/annotations
   → Render tất cả markers từ DB
   → Click vào marker → xem comment → resolve
```

### 8.3 Tọa độ %

**Tại sao dùng % thay vì pixel?**

| Vấn đề | Pixel | % |
|--------|-------|---|
| Responsive | Sai lệch khi resize | Chính xác |
| Zoom | Cần recalculate | Tự động scale |
| Màn hình khác nhau | Lệch vị trí | Giống nhau |

**Công thức:**
```
// Khi tạo
percentX = (clickX / canvasWidth) * 100
percentY = (clickY / canvasHeight) * 100

// Khi render
pixelX = (percentX / 100) * currentCanvasWidth
pixelY = (percentY / 100) * currentCanvasHeight
```

### 8.4 Fabric.js canvas setup

```typescript
// design-canvas.tsx — pseudocode
useEffect(() => {
  const canvas = new fabric.Canvas('design-canvas', {
    selection: false,
    preserveObjectStacking: true,
  });

  fabric.Image.fromURL(imageUrl, (img) => {
    canvas.setDimensions({ width: img.width, height: img.height });
    canvas.add(img);
    canvas.renderAll();
  });

  // Click để thêm marker
  canvas.on('mouse:down', (options) => {
    if (isClientMode) {
      const pointer = canvas.getPointer(options.e);
      openAnnotationPopup(pointer.x, pointer.y);
    }
  });

  return () => canvas.dispose();
}, [imageUrl]);
```

---

## 9. WebSocket Realtime

### 9.1 NestJS Gateway

```typescript
@WebSocketGateway({
  cors: { origin: ['http://localhost:3001', 'http://localhost:3002'] },
  namespace: '/ws',
})
export class MaisonGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Client gửi projectId để join room
    const projectId = client.handshake.query.projectId;
    client.join(`project:${projectId}`);
  }
}
```

### 9.2 Events

| Event | Từ → Đến | Khi nào |
|-------|----------|---------|
| `annotation:created` | Client → Designer | Client comment |
| `comment:added` | Both → Room | Ai đó reply |
| `annotation:resolved` | Designer → Client | Designer resolve |
| `design:new-version` | Designer → Client | Upload version mới |
| `room:approved` | Client → Designer | Client duyệt phòng |
| `project:status-changed` | Admin → All | Đổi trạng thái |

### 9.3 Socket.io Client

```typescript
// hooks/use-socket.ts
import { io } from 'socket.io-client';

export function useSocket(projectId: string) {
  const socket = useMemo(() => {
    return io(`${process.env.NEXT_PUBLIC_API_URL}/ws`, {
      query: { projectId },
      transports: ['websocket'],
    });
  }, [projectId]);

  useEffect(() => {
    socket.on('annotation:created', (data) => {
      // Refresh annotations list
    });
    socket.on('design:new-version', (data) => {
      // Show notification
    });
    return () => { socket.disconnect(); };
  }, [socket]);

  return socket;
}
```

---

## 10. Authentication & Authorization

### 10.1 Backend (NestJS)

**JWT Strategy:**
- `access_token`: 24h (httpOnly cookie)
- `refresh_token`: 7 ngày
- Bcrypt hash cho password

**Role-based guards:**
```typescript
@Roles('admin')       // Chỉ admin
@Roles('designer')    // Chỉ designer
@Roles('client')      // Chỉ client
```

**Client chỉ xem được project của mình:**
```typescript
// Trong ProjectsService
async findOne(id: string, user: User) {
  const project = await this.repo.findOne({ where: { id } });
  if (user.role === 'client' && project.client.id !== user.id) {
    throw new ForbiddenException();
  }
  return project;
}
```

### 10.2 Frontend (Next.js 16)

**Auth Proxy** (thay vì middleware.ts):

```typescript
// client/proxy.ts
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (token) return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|static|public|.*\\..*).*)'],
};
```

---

## 11. File Storage (Cloudinary)

### 11.1 Backend config

```typescript
// upload/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### 11.2 Upload service

```typescript
// upload/upload.service.ts
@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<{
    url: string;
    publicId: string;
    width: number;
    height: number;
  }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'maison/designs',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
```

---

## 12. Multi-language (i18n)

### 12.1 Chiến lược

- **Thư viện**: `next-intl` (Next.js App Router compatible)
- **Ngôn ngữ**: Bắt đầu với Tiếng Việt (`vi`), sau đó thêm English (`en`)
- **Backend**: Tự xây dựng I18nService đơn giản với JSON files
- **Phát hiện ngôn ngữ**: Dựa vào:
  1. `Accept-Language` header (backend)
  2. Cookie `NEXT_LOCALE` (frontend)
  3. URL prefix: `/vi/dashboard`, `/en/dashboard`

### 12.2 Backend i18n

```
backend/src/i18n/locales/
├── vi/
│   ├── auth.json        { "loginSuccess": "Đăng nhập thành công" }
│   ├── project.json     { "created": "Đã tạo dự án thành công" }
│   ├── annotation.json  { "created": "Đã thêm phản hồi" }
│   ├── email.json       { "subject": "Có phản hồi mới từ khách hàng" }
│   └── validation.json  { "required": "Trường {field} là bắt buộc" }
└── en/
    ├── auth.json        { "loginSuccess": "Login successful" }
    └── ...
```

### 12.3 Frontend next-intl

```typescript
// client/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'vi'; // Mặc định
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

---

## 13. Email (Nodemailer)

### 13.1 Backend config

```typescript
// email/email.service.ts
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST'),
      port: configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS'),
      },
    });
  }

  async sendNewCommentNotification(to: string, data: {
    clientName: string;
    projectName: string;
    comment: string;
    link: string;
  }) {
    await this.transporter.sendMail({
      from: '"Maison" <no-reply@maison.vn>',
      to,
      subject: `[Maison] Phản hồi mới từ ${data.clientName}`,
      html: this.renderTemplate('new-comment', data),
    });
  }

  async sendNewVersionNotification(to: string, data: {
    designerName: string;
    projectName: string;
    roomName: string;
    version: number;
    link: string;
  }) {
    await this.transporter.sendMail({
      from: '"Maison" <no-reply@maison.vn>',
      to,
      subject: `[Maison] Phiên bản thiết kế mới — ${data.roomName}`,
      html: this.renderTemplate('new-version', data),
    });
  }
}
```

### 13.2 Email templates

Sử dụng **Handlebars** (`.hbs`):

```html
<!-- email/templates/new-comment.hbs -->
<h2>Phản hồi mới từ {{clientName}}</h2>
<p>Dự án: <strong>{{projectName}}</strong></p>
<p>Nội dung: {{comment}}</p>
<a href="{{link}}">Xem chi tiết →</a>
```

### 13.3 .env variables

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 14. Packages cần thêm

### 14.1 Backend

```bash
# Auth
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt

# WebSocket
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io

# File upload
npm install multer @types/multer
npm install cloudinary streamifier
npm install -D @types/streamifier

# Email
npm install nodemailer handlebars @types/nodemailer

# Validation
npm install class-validator class-transformer

# UUID
npm install uuid
npm install -D @types/uuid
```

### 14.2 Client / Maison

```bash
# Annotation
npm install fabric @types/fabric

# HTTP
npm install axios

# Socket.io
npm install socket.io-client

# UI (TailwindCSS)
npm install -D tailwindcss @tailwindcss/postcss postcss

# i18n
npm install next-intl

# Form
npm install react-hook-form @hookform/resolvers zod

# Date
npm install date-fns

# Image zoom
npm install medium-zoom @types/medium-zoom
```

---

## 15. Roadmap phát triển

### Phase 1: Setup & Auth (Tuần 1-2)

| Task | App | Chi tiết |
|------|-----|----------|
| Fix TypeORM version | backend | Sửa `"typeorm": "^1.0.0"` → `"^0.3.x"` |
| Cài packages | backend | JWT, bcrypt, Socket.io, Cloudinary, ... |
| User entity + migration | backend | Tạo bảng users |
| Auth module | backend | Register, login, JWT strategy, RolesGuard |
| Proxy + Auth pages | client + maison | Login page, auth proxy |
| TailwindCSS setup | client + maison | PostCSS config + globals.css |
| i18n setup | backend | I18nService + locales JSON |

### Phase 2: Project CRUD (Tuần 3-4)

| Task | App | Chi tiết |
|------|-----|----------|
| Entities | backend | Project, Stage, Room, DesignVersion, DesignImage |
| Module Projects | backend | CRUD + phân quyền |
| Dashboard UI | client | Sidebar, project list, project detail |
| Dashboard UI | maison | Quản lý project, tạo mới, gán designer |

### Phase 3: Upload + Annotation Engine (Tuần 5-8) ⭐

| Task | App | Chi tiết |
|------|-----|----------|
| Upload module | backend | Cloudinary upload, DesignVersion create |
| Upload form | maison | Drag-drop, preview, notes |
| Fabric.js canvas | client | Load ảnh, zoom, pan |
| Click → marker | client | Annotation tọa độ % |
| Annotation API | backend | CRUD annotations + comments |
| Sidebar feedback | client | Danh sách comment |
| Feedback panel | maison | Danh sách + resolve |
| Version slider | client | Before/After so sánh |

### Phase 4: Realtime + Notifications (Tuần 9-10)

| Task | App | Chi tiết |
|------|-----|----------|
| Socket.io gateway | backend | Namespace, rooms |
| Socket.io client | client + maison | Kết nối + events |
| Notification entity | backend | Lưu notification DB |
| Notification UI | client + maison | Bell icon, dropdown |
| Email service | backend | Nodemailer + templates |

### Phase 5: Hoàn thiện (Tuần 11-12)

| Task | Chi tiết |
|------|----------|
| Approve room flow | Client duyệt → status thay đổi |
| Stage checklist | Thêm/bớt checklist items |
| Version history UI | Timeline các version |
| Dashboard thống kê | Biểu đồ, số liệu |
| Language switcher | Chuyển đổi VI ↔ EN |
| Responsive | Mobile-friendly |

### Phase 6: Nâng cao (Post-MVP)

- Export báo giá PDF
- 3D viewer (Three.js)
- Chat realtime riêng
- Audit log
- Multi-language bổ sung (JP, KR, ...)
- Recycle bin

---

## 16. Các vấn đề cần lưu ý

### 16.1 Next.js 16 Breaking Changes

| Vấn đề | Cách xử lý |
|---------|------------|
| `middleware.ts` → `proxy.ts` | Đổi tên file + export `proxy` thay vì `middleware` |
| `params` bất đồng bộ | `const { id } = await params` — bắt buộc async |
| `searchParams` bất đồng bộ | `const filters = await searchParams` |
| `priority` → `preload` | Dùng `preload={true}` trên `next/image` |
| `images.qualities` | Phải cấu hình nếu cần quality khác `[75]` |
| Turbopack mặc định | Custom webpack config cần thêm `--webpack` |

### 16.2 Backend

| Vấn đề | Cách xử lý |
|---------|------------|
| TypeORM version | Sửa `package.json`: `"typeorm": "^0.3.x"` |
| DB_SYNC = true | Chỉ dùng dev, production dùng migration |
| CORS | Cấu hình 2 origins: `localhost:3001`, `localhost:3002` |
| Cloudinary env | Thêm `.env` vars: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |

### 16.3 .env mẫu cho backend

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=maison_db
DB_SYNC=true

JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## Kết luận

Maison là nền tảng giúp cách mạng hóa quy trình thiết kế nội thất — từ khâu tiếp nhận, thiết kế, phản hồi đến bàn giao. Với annotation realtime trên ảnh, quản lý version rõ ràng, và thông báo tức thời, cả khách hàng và công ty đều tiết kiệm thời gian và tránh sai sót.

**Bắt đầu với Phase 1: Setup & Auth.**
