# Didaktika landing page

Standalone static HTML/CSS/JavaScript exported from the reviewed Site. This folder is independent of the React/Vite Didaktika Lab application in the repository root. No npm dependencies, installation, or build step are required.

## Local preview and syntax checks

From the repository root:

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory landing
```

Open `http://127.0.0.1:8080/`. Serve the folder over HTTP rather than opening `index.html` as a local file.

```sh
node --check landing/config.js
node --check landing/app.js
```

`index.html` loads `styles.css`, then `config.js` and `app.js`, and uses images from `assets/`. All paths are relative to this folder, which becomes `/` in the separate project. There are no dependencies on the Lab's `src/`, `dist/`, `api/`, or root environment variables.

## Separate Vercel project

Import the same Git repository as a **new Vercel project**. In that project's Settings → Build and Deployment, use:

| Setting | Value |
| --- | --- |
| Root Directory | `landing` |
| Framework Preset | `Other` |
| Build Command | Override enabled; leave the value empty |
| Install Command | Override enabled; leave the value empty |
| Output Directory | Override enabled; `.` |
| Include files outside the root directory in the Build Step | Disabled; this site does not need them |
| Environment Variables | None required for this static page |

`landing/vercel.json` pins the framework to `Other` (`null`), skips installation and building with empty command strings, and serves this folder directly. Root Directory must still be set to `landing` in the Vercel project; it is not a `vercel.json` property. Output Directory `.` is relative to that root, so do not use `dist` or `landing` as the output directory.

Use `feat/didaktika-landing` as the source branch for reviewing these changes. Production Branch is a separate Git setting: select that branch only if it is intended to serve the new project's production domain; otherwise it remains a preview branch. These instructions do not create or deploy a project.

Keep the existing Didaktika Lab Vercel project and the repository-root `vercel.json` unchanged. Do not copy the Lab's Vite build command or SPA rewrite into the landing project. This page uses fragment links and needs no SPA fallback.

References: [Vercel build, output and root settings](https://vercel.com/docs/builds/configure-a-build), [static configuration](https://vercel.com/docs/project-configuration/vercel-json).

## Assessment and waitlist behavior

Public runtime settings are in `config.js`; this is plain browser JavaScript, not a Vite environment-variable file. `config.js` must load before `app.js`.

- Both assessment links use the configured Google Forms URL and open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`. They do not submit a waitlist registration.
- Waitlist submission is enabled and uses the existing production n8n endpoint. Full name, valid email, role, English level and explicit checkbox consent are required; whitespace-only names are rejected. The hidden website field is a honeypot.
- The JSON payload includes the existing identity, role/level, consent/version, timestamp, submission ID, signup source and UTM fields. Unknown/below-A2 levels use `level_source: "unknown"`.
- Success appears **only** for an HTTP-successful response (`response.ok`) whose parsed JSON contains `success === true`. A false/missing/non-boolean flag, invalid/empty JSON, HTTP failure, network/CORS failure or timeout shows an error and retains the form for retry. The timeout is 15 seconds.
- Only one request can be pending at a time. An unchanged retry reuses its submission ID; editing a field creates a new attempt. Server-side validation and deduplication remain the backend's responsibility.
- The success message acknowledges the accepted response on this page. It does not promise a confirmation email. No automatic confirmation-email flow is implemented here.

## Integration checks still required

Do not send test registrations to the active n8n endpoint during local review. Use intercepted/mock responses for local form tests.

Before enabling a new Vercel origin, the n8n endpoint must allow that origin through CORS, answer the JSON POST's `OPTIONS` preflight, and return its response with the appropriate CORS headers. Browser-side error handling cannot confirm whether a timed-out or unreadable request reached the server.

Real registration persistence, all-field storage, deduplication, email behavior, Google Forms availability/content, and CORS from the eventual Vercel origin require separate verification. A strict accepted HTTP/JSON response alone does not prove durable storage. Production hosting, domain settings and deployment have not been verified locally.
