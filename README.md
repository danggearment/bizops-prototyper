# BizOps Prototyper

Ứng dụng prototype cho BizOps, được xây dựng với React + TypeScript + Vite.

## Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy tính đã cài đặt:

- **Node.js** phiên bản 18 trở lên
- **pnpm** (package manager)
- **Git** (để clone project)

---

### 1. Cài đặt Git

**Windows:**
1. Tải Git tại: https://git-scm.com/download/win
2. Chạy file `.exe` vừa tải
3. Nhấn **Next** cho đến khi hoàn tất cài đặt

**macOS:**
1. Mở Terminal (tìm trong Spotlight hoặc Applications > Utilities)
2. Chạy lệnh:
   ```bash
   xcode-select --install
   ```
3. Nhấn **Install** trong popup hiện ra

**Kiểm tra cài đặt thành công:**
```bash
git --version
```

---

### 2. Cài đặt Node.js

**Windows:**
1. Tải Node.js tại: https://nodejs.org/en/download
2. Chọn phiên bản **LTS** (khuyến nghị)
3. Tải file `.msi` cho Windows
4. Chạy file vừa tải và nhấn **Next** cho đến khi hoàn tất

**macOS:**
1. Tải Node.js tại: https://nodejs.org/en/download
2. Chọn phiên bản **LTS** (khuyến nghị)
3. Tải file `.pkg` cho macOS
4. Mở file vừa tải và làm theo hướng dẫn

**Kiểm tra cài đặt thành công:**
```bash
node --version
```

---

### 3. Cài đặt pnpm

Sau khi cài Node.js xong, mở Terminal (macOS) hoặc Command Prompt/PowerShell (Windows) và chạy:

```bash
npm install -g pnpm
```

**Kiểm tra cài đặt thành công:**
```bash
pnpm --version
```

---

### 4. Cài đặt Claude Code

Claude Code là công cụ AI hỗ trợ sinh code và prototype tự động.

#### Cách 1: Sử dụng VSCode Extension (Khuyến nghị)

1. Mở **Visual Studio Code**
2. Vào **Extensions** (Ctrl+Shift+X hoặc Cmd+Shift+X)
3. Tìm kiếm **"Claude Code"**
4. Nhấn **Install**
5. Sau khi cài xong, nhấn **Ctrl+Shift+P** (Windows) hoặc **Cmd+Shift+P** (macOS)
6. Gõ **"Claude: Sign In"** và đăng nhập bằng tài khoản Anthropic

#### Cách 2: Cài đặt CLI

**macOS:**
```bash
brew install claude-code
```

**Windows (PowerShell):**
```powershell
winget install Anthropic.ClaudeCode
```

**Hoặc cài qua npm:**
```bash
npm install -g @anthropic-ai/claude-code
```

**Kiểm tra cài đặt thành công:**
```bash
claude --version
```

#### Đăng nhập Claude Code

Sau khi cài đặt, chạy lệnh sau để đăng nhập:

```bash
claude login
```

Làm theo hướng dẫn trên màn hình để hoàn tất đăng nhập.

---

## Hướng dẫn Setup Project

### Bước 1: Clone project

```bash
git clone https://github.com/gearment/bizops-prototyper.git
cd bizops-prototyper
```

### Bước 2: Tạo file cấu hình môi trường

Tạo file `.env` trong thư mục gốc của project với nội dung sau:

```env
NPM_CONFIG_TOKEN=<token-được-cấp>
VITE_BASE_URL=https://api.dev.geadev.com
VITE_TIMEOUT_NUMBER=200000
VITE_BASE_PATH=
```

**Lưu ý:** Liên hệ team Dev để được cấp `NPM_CONFIG_TOKEN`. Token này cần thiết để tải các package nội bộ của Gearment.

### Bước 3: Cài đặt dependencies

```bash
pnpm install
```

### Bước 4: Chạy ứng dụng

```bash
pnpm dev
```

Sau khi chạy lệnh, mở trình duyệt và truy cập: http://localhost:5173

## Các lệnh thường dùng

| Lệnh | Mô tả |
|------|-------|
| `pnpm dev` | Chạy ứng dụng ở chế độ development |
| `pnpm build` | Build ứng dụng cho production |
| `pnpm preview` | Xem trước bản build production (port 3000) |
| `pnpm lint` | Kiểm tra lỗi code |
| `pnpm format` | Format code |

## Xử lý lỗi thường gặp

### Lỗi: Không tải được package @gearment/*

**Nguyên nhân:** Token chưa được cấu hình hoặc đã hết hạn.

**Cách khắc phục:**
1. Kiểm tra file `.env` đã có `NPM_CONFIG_TOKEN` chưa
2. Liên hệ team Dev để lấy token mới nếu token cũ hết hạn

### Lỗi: Port 5173 đã được sử dụng

**Cách khắc phục:** Đóng ứng dụng khác đang sử dụng port 5173, hoặc chạy với port khác:

```bash
pnpm dev --port 3000
```

## Sử dụng Claude Code trong Project

Project này đã được cấu hình sẵn để Claude Code tự động:
- Cài đặt dependencies nếu chưa có
- Khởi động dev server
- Tự động commit và push code sau mỗi thay đổi

### Cách sử dụng

1. Mở project trong VSCode
2. Mở Claude Code panel (Ctrl+Shift+P > "Claude: Open Panel")
3. Mô tả tính năng bạn muốn tạo, ví dụ:
   - "Tạo form đăng ký người dùng"
   - "Tạo bảng hiển thị danh sách sản phẩm"
   - "Tạo dashboard thống kê doanh thu"

Claude Code sẽ tự động sinh code và cập nhật vào project.

---

## Liên hệ hỗ trợ

Nếu gặp vấn đề trong quá trình setup, vui lòng liên hệ team Development.
