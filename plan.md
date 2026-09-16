# SOLA - Kế Hoạch Triển Khai Nhánh Foundation (Milestone 1)

## 1. Trạng Thái Hiện Tại
- **Nhánh Git**: `Foundation`
- **Tài liệu quy chuẩn**: `Agent-Skill/FRONTEND_AGENT_SKILL.md`
- **Thiết kế UI/UX**: `Image-UI-Ux/` (`Onboarding.png`, `Onboarding Placement Test.png`, `Onboarding Placement Test Results.png`)

---

## 2. Các Hạng Mục Triển Khai

### A. Foundation Base
- [x] Cài đặt dependencies (`npm install`)
- [x] Cấu hình Tailwind CSS (`tailwind.config.ts`, `postcss.config.mjs`) với bộ màu SOLA Design v1.0
- [x] Thiết lập Design Tokens, Typography và Animations (`tokens.css`, `typography.css`, `animations.css`)
- [x] Shared UI Primitives: `Button`, `Card`, `OptionCard`, `Badge`, `ProgressRing`, `ProgressBar`, `Avatar`
- [x] App Shell: `AppSidebar` (Logo SOLA, Menu chính, Minh họa bình minh chân trang), `AppHeader` (Search, Thông báo, User Alex)

### B. Màn hình Onboarding (`/onboarding`)
- [x] Header & Thanh điều hướng 4 bước (`OnboardingStepper`)
- [x] Lưới chọn mục tiêu học tập (`GoalSelection`)
- [x] Lưới chọn đối tượng người học (`LearnerProfileStep`)
- [x] Lưới chọn thời gian học/ngày (`StudyTimeSelection`)
- [x] Lưới chọn kỳ hạn mục tiêu (`TargetSelection`)
- [x] Khối trang trí bên phải (`OnboardingDecorativePanel`)
- [x] Xử lý form state và nút CTA `Continue →`

### C. Màn hình Kiểm Tra Năng Lực (`/assessment/test`)
- [x] Thanh tiến độ bài thi tổng quan (25%) & 4 thẻ kỹ năng con (Grammar, Vocabulary, Listening, Speaking)
- [x] Thẻ câu hỏi trắc nghiệm với các lựa chọn A, B, C, D (`PlacementQuestionCard`)
- [x] Khối bên phải "Why this test matters" & Gia sư AI Maya (`MayaTutorBubble`)
- [x] Điều hướng câu hỏi trước/sau và chuyển sang trang kết quả

### D. Màn hình Kết Quả Năng Lực (`/assessment/result`)
- [x] Bảng trình độ ước lượng Intermediate (B1) & Mục tiêu IELTS 7.5
- [x] Trích dẫn động viên từ AI Tutor Maya
- [x] Lưới 6 vòng tròn tiến độ kỹ năng với nhãn "Strongest skill" và "Focus area"
- [x] Khối nhận định AI Insights
- [x] Lộ trình học tập cá nhân hóa theo các tuần (Weeks 1-4 đến Weeks 17-24)
- [x] Nút CTA `Start my learning path →`

---

## 3. Tiêu Chuẩn Hoàn Thành (Definition of Done)
- Khớp nhận diện SOLA Design v1.0 trong ảnh thiết kế.
- TypeScript nghiêm ngặt, không có lỗi linter.
- Build Next.js thành công (`npm run build`).

