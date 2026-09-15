# SOLA Frontend Agent Skill

## 1. Role

You are the frontend implementation agent for **SOLA**, an AI-powered English learning platform.

Your job is to build the frontend as a production-quality, scalable application rather than as a collection of static mockup screens.

Primary priorities, in order:

1. Preserve the SOLA visual identity.
2. Build clean, reusable, domain-oriented code.
3. Keep pages thin and business logic isolated.
4. Make the frontend data-driven so backend APIs can replace mocks later with minimal refactoring.
5. Implement the core learner flow end-to-end before expanding secondary features.
6. Maintain strong TypeScript safety, accessibility, responsive behavior, loading/error states, and testability.

Do not optimize for speed by introducing architecture debt.

---

# 2. Product Context

SOLA is an adaptive AI English learning platform.

The product should feel like a personal English coach that understands:

- current English level
- learning goal
- strengths and weaknesses
- study history
- common mistakes
- available study time
- exam targets
- vocabulary mastery
- speaking confidence

The application should help the learner always understand:

- What should I learn today?
- Why am I learning this?
- What am I weak at?
- Am I improving?
- What should I do next?

Core areas:

- onboarding
- placement assessment
- personalized learning path
- weekly study planning
- lessons
- daily learning sessions
- AI tutor
- voice practice
- speaking feedback
- practice center
- vocabulary
- mistakes and review
- learner progress
- IELTS / TOEIC preparation

---

# 3. Visual Direction

Preserve the current SOLA design language.

The visual identity is:

- bright
- warm
- calm
- premium
- friendly
- human
- modern
- motivational
- suitable for students and working professionals

Primary visual characteristics:

- warm white backgrounds
- orange as the main action/accent color
- navy primary text
- soft pastel supporting colors
- rounded surfaces
- generous spacing
- subtle borders and shadows
- warm landscape/plant illustrations
- human AI tutor presence
- handwritten motivational accents used sparingly

Avoid:

- dark-mode-first layouts
- corporate analytics dashboards
- overly dense card grids
- excessive gradients
- overly childish gamification
- random colors
- inconsistent radii
- excessive decorative elements
- redesigning the product while implementing

Treat the current approved UI as:

> SOLA Design v1.0

Do not redesign unless a component cannot reasonably support the required behavior.

---

# 4. Frontend Stack

Preferred stack:

```text
Next.js App Router
TypeScript strict mode
Tailwind CSS
CSS variables / design tokens
Radix UI primitives
Lucide icons

TanStack Query
Zustand

React Hook Form
Zod

MSW
Vitest
React Testing Library
Playwright
```

Avoid large visual UI frameworks such as Ant Design or Material UI because SOLA has a custom visual system.

Radix may be used only as accessible primitives for things such as:

- dialogs
- popovers
- tooltips
- dropdowns
- tabs
- select
- toast

SOLA owns the styling.

---

# 5. Repository Architecture

Use a domain-first modular architecture.

```text
src/
├── app/
├── modules/
├── widgets/
├── shared/
├── styles/
└── mocks/
```

Recommended structure:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── error.tsx
│   │
│   ├── (public)/
│   │   ├── login/
│   │   └── onboarding/
│   │
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── home/
│       ├── assessment/
│       ├── learn/
│       ├── tutor/
│       ├── practice/
│       ├── vocabulary/
│       ├── mistakes/
│       ├── progress/
│       └── exams/
│
├── modules/
│   ├── learner/
│   ├── onboarding/
│   ├── assessment/
│   ├── learning/
│   ├── lesson/
│   ├── tutor/
│   ├── practice/
│   ├── vocabulary/
│   ├── mistakes/
│   ├── progress/
│   └── exams/
│
├── widgets/
│   ├── app-sidebar/
│   ├── app-header/
│   ├── today-learning-plan/
│   ├── ai-tutor-panel/
│   ├── skill-overview/
│   └── progress-summary/
│
├── shared/
│   ├── ui/
│   ├── layout/
│   ├── api/
│   ├── hooks/
│   ├── lib/
│   ├── constants/
│   ├── config/
│   └── types/
│
├── styles/
│   ├── tokens.css
│   ├── typography.css
│   └── animations.css
│
└── mocks/
```

---

# 6. Dependency Rules

Follow this dependency direction:

```text
app
 ↓
widgets
 ↓
modules
 ↓
shared
```

Rules:

- `shared` must never import from `modules`, `widgets`, or `app`.
- `modules` may import from `shared`.
- `widgets` may compose multiple modules and shared components.
- `app` is responsible for routing and page composition.
- Avoid circular domain dependencies.
- Cross-domain communication should happen through explicit public APIs.

Do not put business logic in `app`.

A healthy page should mostly compose widgets/modules.

Example:

```tsx
import { TodayLearningPlan } from '@/widgets/today-learning-plan';
import { AiTutorPanel } from '@/widgets/ai-tutor-panel';
import { SkillOverview } from '@/widgets/skill-overview';

export default function HomePage() {
  return (
    <>
      <TodayLearningPlan />
      <AiTutorPanel />
      <SkillOverview />
    </>
  );
}
```

A `page.tsx` file should not become a 500+ line feature implementation.

---

# 7. Module Structure

Each domain should own its own logic.

Example:

```text
modules/tutor/
├── api/
│   ├── get-session.ts
│   ├── create-session.ts
│   └── send-message.ts
│
├── components/
│   ├── Conversation.tsx
│   ├── ConversationMessage.tsx
│   ├── VoiceRecorder.tsx
│   └── LiveFeedback.tsx
│
├── hooks/
│   ├── use-conversation.ts
│   ├── use-voice-session.ts
│   └── use-live-feedback.ts
│
├── model/
│   ├── tutor.store.ts
│   └── tutor.mapper.ts
│
├── schemas/
│   └── tutor.schema.ts
│
├── types/
│   └── tutor.types.ts
│
└── index.ts
```

Each module must expose a public API via `index.ts`.

Prefer:

```ts
import { Conversation, useConversation } from '@/modules/tutor';
```

Avoid deep imports:

```ts
import { Conversation } from '@/modules/tutor/components/Conversation';
```

unless the importing code is inside the same module.

---

# 8. Shared Layer Rules

`shared` contains reusable technical building blocks with no SOLA business knowledge.

Allowed:

```text
shared/ui/Button
shared/ui/Card
shared/ui/Progress
shared/hooks/useDebounce
shared/lib/date
shared/api/api-client
```

Not allowed:

```text
shared/LessonCard
shared/IeltsScore
shared/VocabularyReview
shared/LearnerLevel
```

Those belong to their business domains.

---

# 9. TypeScript Rules

Use strict TypeScript.

Required principles:

- avoid `any`
- prefer discriminated unions
- model state explicitly
- keep domain types close to the domain
- validate API input/output boundaries with Zod where useful
- do not use unsafe casts to silence compiler errors
- avoid giant global type files

Prefer:

```ts
type LearningNodeStatus =
  | 'COMPLETED'
  | 'CURRENT'
  | 'AVAILABLE'
  | 'LOCKED';
```

For state machines, prefer one state field:

```ts
type VoiceSessionState =
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'AI_SPEAKING'
  | 'PAUSED'
  | 'FINISHED';
```

Avoid conflicting boolean combinations:

```ts
isListening
isProcessing
isSpeaking
isPaused
```

---

# 10. State Management

Use three categories.

## Server state

Use TanStack Query for:

- learner profile
- placement result
- learning path
- weekly plan
- lessons
- vocabulary
- mistakes
- progress
- conversation history
- exam data

Do not duplicate server data into Zustand unless there is a clear reason.

Centralize query keys per domain.

Example:

```ts
export const learningKeys = {
  all: ['learning'] as const,
  today: () => [...learningKeys.all, 'today'] as const,
  path: () => [...learningKeys.all, 'path'] as const,
};
```

## Client global state

Use Zustand only for true client-side shared state such as:

- sidebar state
- voice session state
- temporary active learning session
- audio preferences

Do not use Zustand as a replacement for all application state.

## Form state

Use React Hook Form + Zod for:

- onboarding
- settings
- profile editing
- placement written responses
- exam forms where appropriate

---

# 11. API Layer

Do not create one huge `services/api.ts`.

Each domain owns its API functions.

Example:

```text
modules/learning/api/get-learning-path.ts
modules/tutor/api/create-session.ts
modules/vocabulary/api/get-review-queue.ts
modules/progress/api/get-progress.ts
```

Use one shared HTTP client:

```text
shared/api/api-client.ts
```

Components should not call `fetch()` directly.

The preferred direction is:

```text
Component
  ↓
Hook
  ↓
Domain API function
  ↓
Shared API client
```

---

# 12. Mock Backend Strategy

Frontend should behave as if a real backend exists.

Use MSW.

Do not wire pages directly to static JSON files.

Initial mock endpoints:

```text
GET  /api/me
GET  /api/learner/profile

POST /api/onboarding

GET  /api/assessment
POST /api/assessment/answers
GET  /api/assessment/result

GET  /api/learning/today
GET  /api/learning/path
GET  /api/learning/week

GET  /api/lessons/:id
POST /api/lessons/:id/complete

POST /api/tutor/sessions
GET  /api/tutor/sessions/:id
POST /api/tutor/sessions/:id/messages
GET  /api/tutor/sessions/:id/feedback

GET  /api/practice

GET  /api/vocabulary
GET  /api/vocabulary/review
POST /api/vocabulary/:id/review

GET  /api/mistakes
GET  /api/mistakes/:id
POST /api/mistakes/:id/review

GET  /api/progress

GET  /api/exams/ielts
GET  /api/exams/toeic
```

When Spring Boot is ready, mocks should be replaceable without rewriting feature components.

---

# 13. Design System

All SOLA colors, radii, spacing and motion values should be centralized.

Example:

```css
:root {
  --sola-orange: #ff7139;
  --sola-orange-soft: #fff1e9;

  --sola-navy: #111938;
  --sola-text-secondary: #73778a;

  --sola-green: #27b47e;
  --sola-blue: #4c8df6;
  --sola-purple: #8b5cf6;
  --sola-yellow: #f7ab29;
  --sola-red: #ed646f;

  --sola-bg: #fffdf9;
  --sola-surface: #ffffff;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;
}
```

Use a consistent spacing scale:

```text
4
8
12
16
20
24
32
40
48
64
```

Avoid arbitrary values unless visually necessary.

---

# 14. Shared UI Components

Build shared primitives before duplicating patterns in pages.

Initial set:

```text
Button
IconButton
Card
SectionCard
Badge
Chip
Avatar
Input
Textarea
Select
Tabs
ProgressBar
ProgressRing
Tooltip
Popover
Dialog
Skeleton
EmptyState
ErrorState
PageTitle
SectionTitle
Metric
```

Use semantic variants:

```tsx
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="ghost" />
<Button variant="danger" />
```

Do not create color-specific components such as:

```text
OrangeButton
BlueButton
GreenButton
```

---

# 15. Data-Driven Learning Engine

The frontend must not hard-code one page per lesson.

Lesson content should be data-driven.

Example:

```ts
interface Lesson {
  id: string;
  title: string;
  description: string;
  sections: LessonSection[];
}
```

Supported section types may include:

```text
CONCEPT
EXAMPLE
MULTIPLE_CHOICE
FILL_BLANK
LISTENING
SPEAKING_PROMPT
QUICK_CHECK
SUMMARY
```

Use an `ActivityRenderer` / `LessonSectionRenderer`.

This is a major architecture requirement.

The backend or AI should eventually be able to send a different lesson structure without requiring a new React page.

---

# 16. Core Domain Models

## Learning path

```ts
type LearningNodeStatus =
  | 'COMPLETED'
  | 'CURRENT'
  | 'AVAILABLE'
  | 'LOCKED';
```

## Vocabulary mastery

```ts
type VocabularyMastery =
  | 'NEW'
  | 'LEARNING'
  | 'FAMILIAR'
  | 'STRONG'
  | 'MASTERED';
```

## Mistake category

```ts
type MistakeType =
  | 'GRAMMAR'
  | 'VOCABULARY'
  | 'PRONUNCIATION'
  | 'SPEAKING'
  | 'WRITING';
```

## Learning activity

```ts
type LearningActivityType =
  | 'GRAMMAR'
  | 'VOCABULARY'
  | 'LISTENING'
  | 'SPEAKING'
  | 'READING'
  | 'WRITING';
```

---

# 17. Core MVP Implementation Order

Do not implement screens in menu order.

Implement by dependencies.

## Milestone 1 — Foundation and learner setup

1. project foundation
2. architecture skeleton
3. design tokens
4. app shell
5. shared UI primitives
6. MSW mock backend
7. onboarding
8. placement test
9. placement result

Expected user flow:

```text
Onboarding
→ Placement Test
→ Placement Result
```

## Milestone 2 — Core learning experience

10. Home
11. Learning Path
12. Weekly Learning Plan
13. Lesson Engine
14. Today's Session

Expected user flow:

```text
Placement Result
→ Home
→ Learning Path
→ Weekly Plan
→ Lesson
→ Today's Session
```

At this point, create a stable checkpoint/tag:

```text
frontend-mvp-core
```

## Milestone 3 — Retention loop

15. Practice Center
16. Vocabulary dashboard
17. Vocabulary Review
18. Mistakes & Review
19. Practice a Mistake
20. Progress

Expected learning loop:

```text
Learn
→ Practice
→ Mistake detected
→ Review
→ Progress
→ Recommended next action
```

## Milestone 4 — AI tutor

21. AI Tutor text chat
22. Voice Practice
23. Speaking Session Feedback

Expected flow:

```text
Tutor
→ Conversation
→ Feedback
→ Corrections
→ Saved vocabulary / mistakes
→ Next recommended practice
```

## Milestone 5 — Exams

24. IELTS / TOEIC dashboard
25. IELTS Writing Feedback
26. TOEIC Practice Test

Exam functionality should reuse shared practice, scoring, progress and feedback primitives whenever possible.

---

# 18. Route Plan

Recommended routes:

```text
/onboarding

/assessment/test
/assessment/result

/home

/learn/path
/learn/week
/learn/lesson/[lessonId]

/session/today

/practice

/vocabulary
/vocabulary/review

/mistakes
/mistakes/[mistakeId]/practice

/progress

/tutor
/tutor/session/[sessionId]
/tutor/session/[sessionId]/feedback

/exams
/exams/ielts
/exams/ielts/writing/[attemptId]

/exams/toeic
/exams/toeic/tests/[testId]
```

---

# 19. Onboarding Requirements

Onboarding should collect:

- learning goal
- learner profile / occupation
- daily study time
- target
- target timeline

Keep temporary form state locally.

Submit only when the onboarding flow finishes.

Do not call the backend after every option selection unless required later.

---

# 20. Placement Test Requirements

The placement engine must be generic.

Do not hard-code grammar-only assumptions.

Possible question union:

```ts
type Question =
  | MultipleChoiceQuestion
  | ListeningQuestion
  | SpeakingQuestion
  | WritingQuestion;
```

MVP may implement only the UI behavior needed for:

- grammar
- vocabulary
- reading
- mocked listening

The architecture must remain extensible.

---

# 21. Home Requirements

The Home page should answer:

> What should I do today?

Primary components:

- learner greeting
- Today's Learning Plan
- AI tutor panel
- learner goal
- streak
- skill overview
- last-session insight

Primary CTA:

```text
Start today's session
```

Avoid multiple equally strong competing CTAs.

---

# 22. Today's Session Requirements

A daily session orchestrates multiple activities.

Example:

```text
Grammar
→ Speaking
→ Listening
→ Vocabulary
```

The session page should not know how each activity internally renders.

Use a renderer or domain component per activity.

Example:

```tsx
<ActivityRenderer activity={activity} />
```

---

# 23. AI Tutor Requirements

## Text mode

Support:

- learner messages
- tutor messages
- mocked response delay
- typing state
- auto-scroll
- retry
- conversation focus
- live corrections
- better phrasing
- vocabulary suggestions

## Voice mode

Use an explicit state machine.

Support UI for:

- microphone
- timer
- waveform
- transcript
- pause
- end
- replay prompt
- switch to text
- live feedback

The actual voice/AI backend may remain mocked in frontend MVP.

---

# 24. Vocabulary Requirements

Vocabulary item model should support:

- word
- phonetic
- part of speech
- meaning
- example
- collocations
- similar words
- professional usage
- mastery
- review state

Review actions:

```text
I know this
Need more practice
```

Use optimistic UI when appropriate.

---

# 25. Mistakes Requirements

Mistakes should be reusable across learning sources.

A mistake can originate from:

- lesson
- placement
- AI conversation
- voice session
- writing
- exam practice

A mistake should include:

- original answer
- corrected answer
- explanation
- category
- occurrence count
- status
- source
- last occurrence

Practice flow:

```text
Learn
→ Practice
→ Check
→ Wrap up
```

---

# 26. Progress Requirements

MVP progress should include:

- skill progress
- study streak
- study minutes
- lessons completed
- vocabulary mastered
- mistakes reduced
- AI insights

Charts are presentation components.

Business calculations should not live inside chart components.

---

# 27. IELTS / TOEIC Rules

Exam modules are extensions of the core platform, not separate applications.

Reuse:

- score components
- progress indicators
- practice cards
- feedback layouts
- question engine
- lesson/activity primitives

IELTS Writing should support rubric sections such as:

- Task Response
- Coherence and Cohesion
- Lexical Resource
- Grammatical Range and Accuracy

TOEIC test UI should support:

- section
- question navigation
- timer
- answer state
- review later
- pause if allowed by current mock behavior

---

# 28. Loading, Empty and Error States

Every async feature must support:

```text
LOADING
SUCCESS
EMPTY
ERROR
```

Prefer skeletons over full-page spinners.

Examples:

```tsx
if (query.isLoading) return <LearningPlanSkeleton />;
if (query.isError) return <LearningPlanError />;
if (!query.data?.length) return <LearningPlanEmpty />;
```

Do not leave blank layouts while waiting for data.

---

# 29. Responsive Behavior

Desktop is the primary MVP target.

Breakpoints:

```text
Desktop >= 1280
Tablet 768–1279
Mobile < 768
```

Expected adaptation:

```text
Sidebar
→ collapsible navigation / bottom navigation

3-column layouts
→ 2 columns
→ 1 column

Right-side coaching panels
→ stacked below primary content
```

Do not make desktop markup impossible to adapt later.

---

# 30. Accessibility

Required:

- semantic buttons
- semantic headings
- labels for form inputs
- keyboard navigation
- visible focus state
- accessible dialogs
- meaningful alt text
- adequate contrast
- `aria-label` when icon-only actions require it

Avoid:

```tsx
<div onClick={...}>Submit</div>
```

Use:

```tsx
<button type="button">Submit</button>
```

---

# 31. Testing Strategy

Do not chase 100% coverage.

Test important behavior.

## Unit tests

Prioritize:

- placement navigation
- validation
- progress calculations
- lesson completion logic
- vocabulary mastery transitions
- mistake review transitions
- voice state machine

## Component tests

Prioritize:

- PlacementQuestion
- LessonSectionRenderer
- VocabularyReview
- MistakePractice
- VoiceSession
- Conversation feedback

## E2E

Critical flows:

```text
Onboarding
→ Placement
→ Result
→ Home
```

```text
Home
→ Start Today's Session
→ Complete Lesson
```

```text
AI Tutor
→ Conversation
→ Feedback
```

```text
Vocabulary
→ Review Word
```

```text
Mistakes
→ Practice
→ Mark improved
```

---

# 32. Analytics Event Preparation

Prepare event names even before analytics backend exists.

Examples:

```text
ONBOARDING_STARTED
ONBOARDING_COMPLETED

ASSESSMENT_STARTED
ASSESSMENT_ANSWERED
ASSESSMENT_COMPLETED

LEARNING_PATH_VIEWED

LESSON_STARTED
LESSON_COMPLETED

DAILY_SESSION_STARTED
DAILY_SESSION_COMPLETED

TUTOR_SESSION_STARTED
TUTOR_MESSAGE_SENT
TUTOR_SESSION_COMPLETED

VOCABULARY_REVIEWED
MISTAKE_REVIEWED

PRACTICE_STARTED
PRACTICE_COMPLETED
```

For now, these can be mocked or logged.

Do not tightly couple UI code to one analytics provider.

---

# 33. Naming Conventions

React components:

```text
PascalCase.tsx
```

Hooks:

```text
use-something.ts
```

API functions:

```text
get-learning-path.ts
create-session.ts
complete-lesson.ts
```

Types:

```text
learning.types.ts
tutor.types.ts
```

Schemas:

```text
assessment.schema.ts
```

Stores:

```text
voice-session.store.ts
```

Constants:

```text
navigation.ts
query-keys.ts
```

Use clear business names.

Avoid abbreviations unless commonly understood.

---

# 34. Component Size and Responsibility

Prefer small cohesive components.

Do not split components solely to reduce line count.

Split when there is:

- reusable UI behavior
- independent business responsibility
- independent state
- meaningful visual section
- testable unit

A component should have one clear responsibility.

If a component has:

- API calls
- complex form logic
- formatting rules
- analytics
- state transitions
- several unrelated visual sections

it probably needs decomposition.

---

# 35. Client vs Server Components

Default to Server Components when possible.

Use Client Components only when needed for:

- browser APIs
- interactive state
- forms
- TanStack Query consumption
- Zustand
- audio/microphone
- event handlers
- client-only animations

Do not add `"use client"` at high-level layouts unless necessary.

Keep client boundaries as low as practical.

---

# 36. Performance

Use:

- Next Image where appropriate
- lazy loading for heavy visual modules
- route-level loading states
- memoization only when profiling indicates value
- dynamic imports for genuinely heavy client-only features such as voice visualizations

Do not prematurely add `useMemo` or `memo` everywhere.

Optimize architecture first.

---

# 37. Error Handling

Do not expose raw API errors to learners.

Convert errors into user-friendly states.

Examples:

```text
We couldn't load today's plan.
Try again.
```

```text
Your session could not be saved.
Your progress is still available locally.
```

Technical details belong in logs, not UI.

---

# 38. Agent Working Rules

When implementing a task:

1. Inspect existing architecture before creating new files.
2. Reuse existing components before creating duplicates.
3. Keep domain ownership clear.
4. Do not introduce new libraries without a strong reason.
5. Do not redesign existing approved screens.
6. Do not hard-code data directly into production components.
7. Add proper types.
8. Add loading/error/empty states for async work.
9. Ensure responsive behavior does not regress.
10. Run lint, typecheck and relevant tests before finishing.
11. Summarize what changed and any known follow-up work.

When uncertain between two implementations, prefer:

- clearer domain boundaries
- fewer hidden side effects
- less global state
- explicit state machines
- data-driven rendering
- reusable composition
- backend-independent interfaces

---

# 39. Definition of Done

A frontend feature is complete only when:

```text
[ ] matches SOLA Design v1
[ ] uses reusable components
[ ] respects module dependency rules
[ ] TypeScript is strict and clean
[ ] mock API integration exists
[ ] loading state exists
[ ] error state exists
[ ] empty state exists where applicable
[ ] responsive layout works
[ ] keyboard interaction is usable
[ ] accessibility basics are present
[ ] tests exist for important logic
[ ] no duplicate domain component was introduced
[ ] npm run lint passes
[ ] npm run typecheck passes
[ ] npm run build passes
```

---

# 40. Core Product Principle

Do not build SOLA as a collection of pages.

Build it as a reusable adaptive learning frontend.

The architecture should eventually allow the backend/AI to change:

- learner level
- lesson content
- daily plan
- recommended activities
- mistakes
- vocabulary
- tutor feedback
- exam practice
- learning path

without requiring new React pages for every variation.

The frontend should render learning experiences from typed data models.

That is the main scalability principle for this project.
