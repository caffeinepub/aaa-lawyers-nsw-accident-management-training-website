# Specification

## Summary
**Goal:** Build a public AAA Lawyers website that offers a NSW (Australia) accident management knowledge base and structured training courses sourced from a provided PDF, with admin content management and trainee progress tracking.

**Planned changes:**
- Create site layout and navigation for Home, Knowledge Base, Courses, About AAA Lawyers, and Contact (placeholders only).
- Implement Knowledge Base with tagged/categorized articles, article listing, and article detail pages populated from PDF-ingested content.
- Implement Training Courses with course → modules/lessons structure, lesson rich text, course listing and detail pages.
- Add trainee sign-in/out with Internet Identity and per-user progress tracking (lesson completion and course progress).
- Add quizzes (at least multiple-choice) attachable to lessons/modules, including per-user attempts/results.
- Build an admin-only area (allowlisted principals) to ingest content from PDF (upload for client-side extraction or paste text) and to create/edit/publish/unpublish Articles, Courses, Lessons, and Quizzes.
- Add backend persistence in a single Motoko actor for all content, progress, and quiz results, with frontend loading via React Query.
- Apply a cohesive professional visual theme across public and admin pages.

**User-visible outcome:** Visitors can browse AAA Lawyers NSW accident management articles and training courses; trainees can sign in with Internet Identity, complete lessons, track progress, and take quizzes; admins can ingest PDF-based content and manage publishing.
