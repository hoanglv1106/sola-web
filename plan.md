# SOLA - Kế Hoạch Triển Khai Nhánh Foundation (Milestone 1)

## 1. Trạng Thái Hiện Tại
- **Nhánh Git**: `Foundation`
- **Tài liệu quy chuẩn**: `Agent-Skill/FRONTEND_AGENT_SKILL.md`
- **Thiết kế UI/UX**: `Image-UI-Ux/` (`Onboarding.png`, `Onboarding Placement Test.png`, `Onboarding Placement Test Results.png`)

---

## 2. Các Hạng Mục Triển Khai

### A. Foundation Base
- [ ] Cài đặt dependencies (`npm install`)
- [ ] Cấu hình Tailwind CSS (`tailwind.config.ts`, `postcss.config.mjs`) với bộ màu SOLA Design v1.0
- [ ] Thiết lập Design Tokens, Typography và Animations (`tokens.css`, `typography.css`, `animations.css`)
- [ ] Shared UI Primitives: `Button`, `Card`, `OptionCard`, `Badge`, `ProgressRing`, `ProgressBar`, `Avatar`
- [ ] App Shell: `AppSidebar` (Logo SOLA, Menu chính, Minh họa bình minh chân trang), `AppHeader` (Search, Thông báo, User Alex)

### B. Màn hình Onboarding (`/onboarding`)
- [ ] Header & Thanh điều hướng 4 bước (`OnboardingStepper`)
- [ ] Lưới chọn mục tiêu học tập (`GoalSelection`)
- [ ] Lưới chọn đối tượng người học (`LearnerProfileStep`)
- [ ] Lưới chọn thời gian học/ngày (`StudyTimeSelection`)
- [ ] Lưới chọn kỳ hạn mục tiêu (`TargetSelection`)
- [ ] Khối trang trí bên phải (`OnboardingDecorativePanel`)
- [ ] Xử lý form state và nút CTA `Continue →`

### C. Màn hình Kiểm Tra Năng Lực (`/assessment/test`)
- [ ] Thanh tiến độ bài thi tổng quan (25%) & 4 thẻ kỹ năng con (Grammar, Vocabulary, Listening, Speaking)
- [ ] Thẻ câu hỏi trắc nghiệm với các lựa chọn A, B, C, D (`PlacementQuestionCard`)
- [ ] Khối bên phải "Why this test matters" & Gia sư AI Maya (`MayaTutorBubble`)
- [ ] Điều hướng câu hỏi trước/sau và chuyển sang trang kết quả

### D. Màn hình Kết Quả Năng Lực (`/assessment/result`)
- [ ] Bảng trình độ ước lượng Intermediate (B1) & Mục tiêu IELTS 7.5
- [ ] Trích dẫn động viên từ AI Tutor Maya
- [ ] Lưới 6 vòng tròn tiến độ kỹ năng với nhãn "Strongest skill" và "Focus area"
- [ ] Khối nhận định AI Insights
- [ ] Lộ trình học tập cá nhân hóa theo các tuần (Weeks 1-4 đến Weeks 17-24)
- [ ] Nút CTA `Start my learning path →`

---

## 3. Tiêu Chuẩn Hoàn Thành (Definition of Done)
- Khớp nhận diện SOLA Design v1.0 trong ảnh thiết kế.
- TypeScript nghiêm ngặt, không có lỗi linter.
- Build Next.js thành công (`npm run build`).

