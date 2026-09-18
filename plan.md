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

---

## 3. Lộ Trình Phát Triển Chi Tiết Theo Phase (Roadmap Chi Tiết)

Toàn bộ 20 ảnh UI/UX trong thư mục `Image-UI-Ux/` được phân bổ chính xác theo 5 Phase nghiệp vụ + 1 Phase hoàn thiện kỹ thuật, tuân thủ nghiêm ngặt quy chuẩn kiến trúc Domain-First Modular và thứ tự phụ thuộc (dependencies).

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Foundation & Placement Setup [COMPLETED]                      │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Core Learning Experience (Items 3 - 7)  → CORE MVP CHECKPOINT │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Retention & Practice Loop (Items 8 - 13) → LEARNING LOOP CKPT │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: AI Tutor & Voice Coaching (Items 14 - 16) → AI MVP CHECKPOINT │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 5: Exam Preparation (IELTS & TOEIC) (Items 17 - 19)             │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 6: Mobile Adaptive, Tests & Polish (Item 20)                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 🟢 PHASE 1: Foundation & Placement Setup (Đã hoàn thành)
- **Mục tiêu**: Xây dựng khung kiến trúc, hệ thống Design Tokens, Shared UI Kit, App Shell và luồng Onboarding ban đầu.
- **UI Mappings**:
  - `Image-UI-Ux/Onboarding.png` → Route `/onboarding`
  - `Image-UI-Ux/Onboarding Placement Test.png` → Route `/assessment/test`
  - `Image-UI-Ux/Onboarding Placement Test Results.png` → Route `/assessment/result`
- **Checklist**:
  - [x] Design Tokens, Typography, Colors (SOLA Orange, Navy, Warm BG), Tailwind config
  - [x] Shared UI Kit (`Button`, `Card`, `OptionCard`, `Badge`, `ProgressRing`, `ProgressBar`, `Avatar`)
  - [x] App Shell (`AppSidebar`, `AppHeader`, `DashboardLayout`)
  - [x] Màn hình Onboarding 4 bước (`/onboarding`)
  - [x] Màn hình Placement Test (`/assessment/test`)
  - [x] Màn hình Placement Result (`/assessment/result`)

---

### 🟢 PHASE 2: Core Learning Experience (Mục 3 → 7) — [CORE MVP CHECKPOINT] (Đã hoàn thành)
- **Mục tiêu**: Hoàn thiện vòng lặp học tập cốt lõi hàng ngày từ trang chủ đến lộ trình tuần, bài học tương tác và buổi học trong ngày.
- **UI Mappings & Routes**:
  1. **Item 3: Home Dashboard** [x]
     - **UI**: `Image-UI-Ux/home.png`
     - **Route**: `src/app/(dashboard)/home/page.tsx`
     - **Module/Widgets**:
       - Widget `TodayLearningPlan`: 4 bài học trong ngày (Speaking, Grammar, Listening, Review) kèm thời lượng.
       - Widget `AiTutorPanel`: Chân dung AI Maya, sóng âm thanh mini, nút "Chat with Maya", quick actions (Talk, Role play, Feedback).
       - Widget `LearnerGoalCard`: Mục tiêu IELTS 7.5, streak 18 ngày, quote truyền cảm hứng.
       - Widget `SkillOverview`: 6 vòng tròn kỹ năng cập nhật theo buổi học gần nhất.
       - Widget `SessionInsightCard`: Insight từ buổi học trước ("You used 'I would rather' correctly today!").
  2. **Item 4: Learning Path** [x]
     - **UI**: `Image-UI-Ux/Learn.png`
     - **Route**: `src/app/(dashboard)/learn/path/page.tsx` (hoặc `/learn`)
     - **Module/Widgets**:
       - `RoadmapStepper`: Con đường học tập qua các giai đoạn (Foundation → Communication → Real-world English "You are here" → Exam Readiness → Achieve Goal).
       - `WeakAreasCard`: Các kỹ năng yếu cần ưu tiên (Speaking fluency, Academic vocabulary, Listening detail).
       - `ThisWeekPathList`: 5 thẻ bài học trọng tâm trong tuần (Grammar in Context, Speaking Fluency, Listening, Vocabulary, Professional English).
  3. **Item 5: Weekly Learning Plan** [x]
     - **UI**: `Image-UI-Ux/learn-week planing.png`
     - **Route**: `src/app/(dashboard)/learn/weekly-plan/page.tsx`
     - **Module/Widgets**:
       - `ThisWeekGoalCard`: Mục tiêu tuần và phân bổ trọng số kỹ năng (Listening 15%, Speaking 35%, Grammar 25%, Professional 25%).
       - `StudyTimeGoalCard`: Tiến độ 150 phút (60/150 min - 40%).
       - `WeeklyCalendarPlanner`: Lịch 7 ngày (Mon → Sun) với trạng thái Completed / Today / Upcoming.
       - `WhyTheseTopicsCard`: Giải thích lý do chọn chủ đề cho tuần.
  4. **Item 6: Lesson Engine (Data-driven)** [x]
     - **UI**: `Image-UI-Ux/Learn-Grammar.png`
     - **Route**: `src/app/(dashboard)/learn/lessons/[lessonId]/page.tsx`
     - **Module/Widgets**:
       - `LessonStepper`: 4 bước học (1. Learn → 2. Practice → 3. Use it → 4. Review).
       - `LessonConceptRenderer`: So sánh cấu trúc (ví dụ: "I'd rather" vs "I prefer"), bảng công thức.
       - `LessonExamples`: Danh sách ví dụ thực tế kèm nút nghe phát âm.
       - `QuickCheckQuiz`: Câu hỏi kiểm tra nhanh dạng radio và giải thích đáp án ngay khi chọn.
       - `MayaTipsCard`: Lời khuyên hữu ích từ gia sư Maya.
  5. **Item 7: Today's Session Runner** [x]
     - **UI**: `Image-UI-Ux/Today's Session.png`
     - **Route**: `src/app/(dashboard)/session/today/page.tsx`
     - **Module/Widgets**:
       - `SessionFlowStepper`: Điều hướng qua 4 hoạt động liên tiếp (Grammar Warm-up 5m → Speaking Practice 8m → Listening Practice 7m → Vocabulary Review 5m).
       - `ActivityRenderer`: Renderer linh hoạt hiển thị bài tập Grammar (chọn "would rather" vs "would rather to"), chấm điểm tức thì.
       - `NextUpCard`: Danh sách các hoạt động tiếp theo trong buổi học.
- **Checkpoint Deliverable**: Learner có thể vào Home → xem kế hoạch ngày → mở lộ trình → chạy trọn vẹn 1 Lesson và 1 Daily Session. [x]

---

### 🟢 PHASE 3: Retention & Daily Practice Loop (Mục 8 → 13) — [LEARNING LOOP CHECKPOINT] (Đã hoàn thành)
- **Mục tiêu**: Xây dựng hệ sinh thái tự luyện tập, củng cố từ vựng (Spaced Repetition), sổ tay lỗi sai cá nhân hóa và bảng theo dõi tiến độ học tập chi tiết.
- **UI Mappings & Routes**:
  1. **Item 8: Practice Center** [x]
     - **UI**: `Image-UI-Ux/Practice Center.png`
     - **Route**: `src/app/(dashboard)/practice/page.tsx`
     - **Nội dung**: Bộ lọc kỹ năng (All, Grammar, Speaking, Listening, Reading, Writing, Vocabulary, Pronunciation, Business, IELTS, TOEIC), khối "Recommended for Alex today", và danh sách "All practice activities" đa dạng.
  2. **Item 9: Vocabulary Dashboard** [x]
     - **UI**: `Image-UI-Ux/vocabulary.png`
     - **Route**: `src/app/(dashboard)/vocabulary/page.tsx`
     - **Nội dung**: Thống kê từ vựng theo 5 mức độ làm chủ (New, Learning, Familiar, Strong, Mastered - tổng 482 từ), hàng chờ ôn tập trong ngày "Today's review queue" (thẻ từ vựng có phiên âm, định nghĩa, ví dụ, collocations, audio).
  3. **Item 10: Vocabulary Review Session** [x]
     - **UI**: `Image-UI-Ux/Practice-vocabulary revioew.png`
     - **Route**: `src/app/(dashboard)/vocabulary/review/page.tsx`
     - **Nội dung**: Giao diện flashcard chuyên sâu, phát âm, ví dụ, cụm từ đi kèm (collocations), từ đồng nghĩa, thanh tiến độ 5 cấp bậc từ vựng, nút "I know this" và "Need more practice".
  4. **Item 11: Mistakes & Review Notebook** [x]
     - **UI**: `Image-UI-Ux/Mistakes & Review.png`
     - **Route**: `src/app/(dashboard)/mistakes/page.tsx`
     - **Nội dung**: Sổ tay gom lỗi sai từ mọi hoạt động (Grammar, Vocabulary, Pronunciation, Speaking, Writing), hiển thị lỗi người dùng nói/viết vs câu sửa chuẩn, biểu đồ tỷ lệ lỗi thường gặp, nút "Practice again" và "Ask Maya".
  5. **Item 12: Practice a Mistake** [x]
     - **UI**: `Image-UI-Ux/Mistakes & Review  - Practice a Mistake.png`
     - **Route**: `src/app/(dashboard)/mistakes/[mistakeId]/practice/page.tsx`
     - **Nội dung**: Bài tập khắc phục lỗi chuyên sâu 4 bước (Learn → Practice → Check → Wrap up), câu hỏi trắc nghiệm củng cố, thanh đo độ tự tin "Your confidence", nút đánh dấu "Mark as improved".
  6. **Item 13: Progress & Analytics** [x]
     - **UI**: `Image-UI-Ux/Progress.png`
     - **Route**: `src/app/(dashboard)/progress/page.tsx`
     - **Nội dung**: Biểu đồ đường tăng trưởng kỹ năng theo thời gian (Last 4 weeks), phân tích AI insights, bảng tổng hợp "Review for today" (Spaced repetition, Pronunciation, Mistakes).
- **Checkpoint Deliverable**: Hoàn thiện trọn vẹn vòng lặp ghi nhớ kiến thức: Học → Luyện tập → Phát hiện lỗi sai → Ôn tập từ vựng & sửa lỗi → Đánh giá tiến bộ. [x]

---

### 🟢 PHASE 4: AI Tutor & Voice Coaching (Mục 14 → 16) — [AI MVP CHECKPOINT] (Đã hoàn thành)
- **Mục tiêu**: Xây dựng trải nghiệm gia sư AI tương tác thời gian thực bằng cả văn bản (Text Chat) và giọng nói (Voice Practice) kèm hệ thống phản hồi sửa lỗi tức thì.
- **UI Mappings & Routes**:
  1. **Item 14: AI Tutor Text Chat** [x]
     - **UI**: `Image-UI-Ux/AI Tutor.png`
     - **Route**: `src/app/(dashboard)/tutor/page.tsx`
     - **Nội dung**: Cuộc trò chuyện tự nhiên với Maya, giả lập tình huống công việc/hội thoại, phản hồi trực tiếp (Live feedback: Corrections, Better phrasing, Vocabulary suggestions), chấm điểm hội thoại (Conversation score).
  2. **Item 15: AI Tutor Voice Practice** [x]
     - **UI**: `Image-UI-Ux/AI-Tutor Voice practice.png`
     - **Route**: `src/app/(dashboard)/tutor/sessions/[sessionId]/page.tsx`
     - **Nội dung**: Giao diện thu âm giọng nói, sóng âm thanh động (animated waveform), đếm thời gian, chuyển đổi lời nói thành văn bản trực tiếp (live transcript), đánh giá phát âm & độ trôi chảy (Fluency & Pronunciation realtime).
  3. **Item 16: Speaking Session Feedback** [x]
     - **UI**: `Image-UI-Ux/AI Tubor feedback speaking.png`
     - **Route**: `src/app/(dashboard)/tutor/sessions/[sessionId]/feedback/page.tsx`
     - **Nội dung**: Báo cáo tổng kết sau buổi nói chuyện: Điểm tổng quát (85/100), phân tích 5 kỹ năng (Fluency, Grammar, Pronunciation, Vocabulary, Confidence), danh sách câu sửa lỗi (Key corrections), cách diễn đạt tự nhiên hơn (Better phrasing), từ vựng mới thu thập được.
- **Checkpoint Deliverable**: Người học có thể giao tiếp với AI Tutor bằng văn bản hoặc giọng nói, nhận phản hồi sửa lỗi chi tiết và lưu từ vựng/lỗi sai tự động. [x]

---

### 🟢 PHASE 5: Exam Preparation Hub (IELTS & TOEIC) (Mục 17 → 19) [COMPLETED]
- **Mục tiêu**: Mô đun luyện thi chứng chỉ quốc tế chuyên sâu, tái sử dụng các primitives từ lõi luyện tập và chấm điểm.
- **UI Mappings & Routes**:
  1. **Item 17: IELTS / TOEIC Dashboard** [x]
     - **UI**: `Image-UI-Ux/IELTS &TOEIC Prep.png`
     - **Route**: `src/app/(dashboard)/exams/page.tsx`
     - **Nội dung**: Tab chuyển đổi IELTS / TOEIC, điểm mục tiêu (7.5) vs điểm dự đoán (6.5), luyện tập theo từng kỹ năng (Listening, Reading, Writing, Speaking), danh sách đề thi thử Mock Test, kết quả thi gần đây.
  2. **Item 18: IELTS Writing Feedback** [x]
     - **UI**: `Image-UI-Ux/IELTS writing feed back.png`
     - **Route**: `src/app/(dashboard)/exams/ielts/writing/[attemptId]/page.tsx`
     - **Nội dung**: Đề bài Task 2, bài viết của học viên kèm highlight lỗi (ngữ pháp, từ vựng, gợi ý khác), bảng chấm điểm 4 tiêu chí chuẩn IELTS (Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range) và kế hoạch cải thiện band điểm.
  3. **Item 19: TOEIC Practice Test Simulation** [x]
     - **UI**: `Image-UI-Ux/topic practice Test.png`
     - **Route**: `src/app/(dashboard)/exams/toeic/tests/[testId]/page.tsx`
     - **Nội dung**: Phòng thi thử mô phỏng Part 1 Photographs (ảnh câu hỏi, audio nghe, 4 lựa chọn A/B/C/D), đồng hồ đếm ngược, nút tạm dừng, đánh dấu xem lại (Review later), bảng điều hướng câu hỏi.
- **Checkpoint Deliverable**: Hỗ trợ đầy đủ luồng ôn thi chứng chỉ chuẩn quốc tế với chấm điểm và gợi ý cải thiện từ AI. [x]

---

### ⚪ PHASE 6: System Polish, Responsiveness & Testing (Mục 20)
- **Mục tiêu**: Đảm bảo tiêu chuẩn sản xuất (production-quality), tối ưu hiển thị đa thiết bị và độ tin cậy của mã nguồn.
- **Checklist**:
  - [ ] Kiểm thử Responsive trên mọi breakpoint (Desktop >= 1280px, Tablet 768-1279px, Mobile < 768px).
  - [ ] Viết Unit Tests cho các logic chuyển đổi trạng thái quan trọng (Vocabulary Mastery, Mistake transitions, Voice state machine, Progress calculations).
  - [ ] Kiểm tra tính tiếp cận (Accessibility - a11y, ARIA labels, bàn phím).
  - [ ] Chạy `npm run lint`, `npx tsc --noEmit`, `npm run build` không phát sinh lỗi hoặc cảnh báo.