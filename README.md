# Didaktika Lab

Didaktika Lab is a React/Vite Proof of Concept for AI-assisted lesson creation with teacher control. It turns source content into CEFR-adapted English lessons and assessment activities. English is the first demonstration of a reusable model based on learning outcomes, structured activities, assessment and expert review that can be adapted to other courses and subject areas.

## Current PoC flow

1. Choose Guardian News or paste your own title and content.
2. Select a CEFR level: A2, B1 (default), B2, C1 or C2.
3. Generate a lesson and quiz through the existing n8n webhook.
4. Review and edit the lesson, questions and answer options. The review stages explain the process; teacher review is a manual step.
5. Save an AI draft, reload saved lessons, then approve and publish a saved lesson. Saving creates a new draft and makes its ID available for learner quiz preview.
6. Send a learner preview to an email address or open `/quiz?lesson_id=...` in a new tab. Learners receive an automatic score and result feedback.
7. Use the Demo Publication Schedule to assign saved lessons to weekday/CEFR slots and save the schedule. Its existing backend week field is retained internally for compatibility.

## Technology

React 19, Vite 8, JavaScript and plain CSS, with ESLint for validation. Existing n8n webhooks handle generation, lesson persistence, publishing, email and schedule storage. The repository also contains an Express development adapter and a Vercel Guardian API function.

## Run locally

Use Node.js 22.12 or newer. If dependencies are missing, run `npm install` once, then:

```sh
npm run dev
```

Validation and production preview:

```sh
npm run lint
npm run build
npm run preview
```

The optional existing Express adapter can be started with `node server.js`. The Vite frontend uses its configured endpoint URLs; running Vite alone does not run Express or Vercel API functions.

## Environment variables

Configure the existing endpoints in a local `.env` file or the Vercel project environment. Vite reads frontend variables at startup/build time, so restart or rebuild after configuration changes.

Frontend:

- `VITE_GUARDIAN_NEWS_URL`
- `VITE_N8N_WEBHOOK_URL`
- `VITE_GET_LESSONS_URL`
- `VITE_SAVE_LESSON_URL`
- `VITE_PUBLISH_LESSON_URL`
- `VITE_SEND_TEST_EMAIL_URL`
- `VITE_GET_LESSON_BY_ID_URL`
- `VITE_SAVE_SCHEDULE_URL`

Existing server adapters:

- `GUARDIAN_API_KEY`
- `N8N_WEBHOOK_URL`
- `GET_LESSONS_URL`
- `VITE_SEND_TEST_EMAIL_URL`
- `PORT`

The unused legacy `NewsFeed` component also references `VITE_GUARDIAN_API_KEY`; the current source panel uses `VITE_GUARDIAN_NEWS_URL`.

Live generation, persistence, publishing, email delivery and schedule storage depend on reachable, configured n8n workflows. Hosted Guardian access and direct learner quiz links also depend on the existing Vercel configuration.

## Scope

Generic LMS and community functionality is intentionally outside the current PoC scope.
