# Sola Web

Sola is an intelligent English learning web application featuring personalized learning paths, AI tutoring, interactive exercises, exam prep (IELTS/TOEIC), and continuous progress tracking.

## Architecture Overview

This project is organized following modular architecture:
- `src/app/`: Next.js App Router (pages, layouts, route handlers only - no business logic).
- `src/modules/`: Business domains (state, models, api services, domain components).
- `src/widgets/`: Complex composite UI blocks (Sidebar, Header, AI Tutor panel, etc.).
- `src/shared/`: Reusable UI kit, utilities, generic hooks, and HTTP client.
- `src/styles/`: Design tokens, typography, and animation definitions.
- `src/mocks/`: Mock data for development and prototyping.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
