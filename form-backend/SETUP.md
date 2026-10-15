# Website form → email + Excel (Web3Forms + standard Power Automate)

No Premium licence needed.

## Part 1 · Web3Forms (2 minutes): the email notification
Done. The Web3Forms account is **luke@inscape.co**, with **admin@inscape.co** as a linked address. The access key is in `book.js`.

Each enquiry emails luke@inscape.co (and admin@inscape.co) with the subject **New consultation request — [name]**. Reply goes straight to the person who enquired.

## Part 2 · Power Automate (10 minutes): the Excel log
Uses only standard connectors. Build the flow while signed in as **luke@inscape.co** (or admin@inscape.co), because it watches the inbox the emails arrive in.

1. **Excel:** a workbook in OneDrive with a table named **Enquiries** and the columns
   `Received`, `First name`, `Last name`, `Work email`, `Situation`, `Message`, `Page`.
2. make.powerautomate.com → **Create → Automated cloud flow**. Trigger: **When a new email arrives (V3)** (Office 365 Outlook).
   - Folder: Inbox · Subject Filter: `New consultation request`
3. **+** → **Content Conversion → Html to text**. Content: **Body** (from the trigger).
4. **+** → **Data Operation → Parse JSON**.
   - Content (expression): `json(first(split(last(split(body('Html_to_text'),'##START##')),'##END##')))`
   - Schema: paste `schema.json` (this folder).
5. **+** → **Excel Online (Business) → Add a row into a table**. Pick the workbook and the **Enquiries** table, then map from Parse JSON:
   Received → `received` · First name → `firstName` · Last name → `lastName` · Work email → `email` · Situation → `situation` · Message → `message` · Page → `page`
6. **Save**. Delete the old "Website enquiries" HTTP flow; it isn't used any more.
