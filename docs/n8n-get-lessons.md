# n8n: GET /get-lessons

Create a workflow in n8n with these nodes:

1. Webhook
   - Method: `GET`
   - Path: `get-lessons`
   - Response mode: `Using Respond to Webhook node`

2. Google Sheets
   - Operation: `Read`
   - Document: your lessons sheet
   - Sheet: the tab that stores lessons
   - Return columns: `lesson_id`, `title`, `level`, `status`, `created_at`

3. Set
   - Keep only:
     - `lesson_id`
     - `title`
     - `level`
     - `status`
     - `created_at`

4. Respond to Webhook
   - Response body: `All incoming items`
   - Response format: `JSON`

The deployed webhook URL should match:

```text
https://mstrak.app.n8n.cloud/webhook/get-lessons
```

The frontend reads that URL from `VITE_GET_LESSONS_URL`.
