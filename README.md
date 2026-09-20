# JIL Lifegroup Attendance

An offline-friendly Lifegroup member, birthday and attendance app. Leaders can record attendance without internet and submit it when they reconnect. Submitted reports appear in a PIN-protected Church Admin dashboard.

Leaders can manage multiple Lifegroups, keep separate members and attendance for each group, and use **All Members** to view everyone’s birthday together with their Lifegroup card. Birthday entry uses simple Day, Month and Year dropdowns.

Each gathering can include up to five photos. Photos are resized before saving and appear in the Church Admin dashboard after submission. Sent gatherings remain in the leader's Attendance History.

## What is included

- `docs/index.html` — leader-facing app
- `docs/admin.html` — Church Admin dashboard
- `docs/config.js` — connection to the attendance database
- `docs/manifest.webmanifest` and `docs/sw.js` — installable/offline support
- `backend/worker.js` — secure attendance API
- `backend/schema.sql` — central database structure
- `backend/wrangler.toml.example` — backend configuration example

No Google Sheet or email app is required.

## Part 1 — Upload to GitHub

1. Create a new GitHub repository named `JIL-Lifegroup-Attendance`.
2. Extract this ZIP.
3. Upload **all extracted files and folders** to the repository.
4. Open the repository’s **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select branch **main**, folder **/docs**, then press **Save**.
7. GitHub will provide a link similar to:
   `https://YOUR-GITHUB-USERNAME.github.io/JIL-Lifegroup-Attendance/`

The app can be opened immediately, but central submission will work only after Part 2.

## Part 2 — Create the free central database

This uses Cloudflare Workers and D1. A free Cloudflare account is sufficient for normal church attendance use.

1. In Cloudflare, open **Workers & Pages → D1 SQL database → Create database**.
2. Name it `jil-lifegroup-attendance`.
3. Open its **Console**, paste everything from `backend/schema.sql`, and run it.
4. Create a new **Worker** named `jil-lifegroup-attendance-api`.
5. Replace the Worker code with everything from `backend/worker.js`, then deploy it.
6. In the Worker’s **Settings → Bindings**, add a **D1 Database** binding:
   - Variable name: `DB`
   - Database: `jil-lifegroup-attendance`
7. Add these Worker variables:
   - `ALLOWED_ORIGINS` = `https://YOUR-GITHUB-USERNAME.github.io`
   - `ADMIN_PIN` = a private PIN known only to the Church Admin. Save it as an encrypted secret if that option is available.
8. Deploy the Worker again and copy its full URL, similar to:
   `https://jil-lifegroup-attendance-api.YOUR-NAME.workers.dev`

## Part 3 — Connect the app

1. In GitHub, open `docs/config.js`.
2. Press the pencil **Edit** button.
3. Replace `PASTE-YOUR-CLOUDFLARE-WORKER-URL-HERE` with the Worker URL from Part 2. Do not add a final `/`.
4. Commit the change.
5. Wait about two minutes, then refresh the GitHub Pages app.

## Links

- Leader app: `https://YOUR-GITHUB-USERNAME.github.io/JIL-Lifegroup-Attendance/`
- Admin dashboard: `https://YOUR-GITHUB-USERNAME.github.io/JIL-Lifegroup-Attendance/admin.html`

## Privacy and backups

- Member names, birthdays, mobile numbers and unsent reports remain in the leader’s browser on that device.
- Submitted attendance names, totals and notes are stored in the central database.
- Leaders should use **Download complete backup** regularly.
- Clearing browser/site data removes the local member list and any reports that have not been submitted.
- Do not place the Admin PIN inside `config.js`, GitHub files or messages to leaders.

## Updating the service worker

When you make a major app update, change the cache name at the top of `docs/sw.js` so devices download the newest files.
