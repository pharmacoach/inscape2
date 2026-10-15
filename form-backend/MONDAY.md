# Website form → Monday CRM (Make.com, free)

Each enquiry creates a lead in Monday with its own columns filled in. Web3Forms keeps sending the email notification alongside.

## 1. Monday: get the board ready
Open your Leads (or Contacts) board and make sure it has these columns:
- Name (the item name)
- First name and Last name (text)
- Email (email column)
- Situation (status or dropdown, with the same options as the website form)
- Message (long text)
- Source page (text)

## 2. Make: create the scenario
1. Sign up at make.com (free plan) and click **Create a new scenario**.
2. Add **Webhooks → Custom webhook**. Click **Add**, name it "Inscape website", then **Save**.
3. Copy the webhook URL and send it to me. I'll add it to the site.
4. Click **Run once** in Make, then submit the website form once, so Make learns the fields.
5. Add **monday.com → Create an Item**. Connect your Monday account and pick the board and group.
   - Item name: `firstName` `lastName`
   - Map each column to its webhook field: `firstName`, `lastName`, `email`, `situation`, `message`, `page`
6. Click **Save**, then turn the scenario **ON** (the switch bottom-left).

Each enquiry uses 2 of the free plan's 1,000 monthly operations.
