# 📄 Project Overview

## 🏷 Project Name  
**Golang Jobs Board**

---

## 📝 Description  
A specialized job board tailored for the Golang ecosystem.  
Companies working with Golang can post job openings without the need for an account.  
Candidates interested in Golang roles can sign in to apply, subscribe to job alerts, and browse opportunities via a powerful and user-friendly interface.

---

## ⚙️ Tech Stack

### 🔹 Frontend
- **Framework:** Next.js `15.3.1` (App Router)
- **Language:** TypeScript `5`
- **UI Library:** React `19.0.0`, ReactDOM `19.0.0`
- **Styling:** Tailwind CSS `4.1.4`

### 🔹 Backend Services
- **Primary Backend:** Supabase `2.49.4`
  - PostgreSQL (Database)
  - Storage (for uploaded assets, if any)
  - Basic authentication integration (Job Alert subscriptions)
- **Authentication:** Clerk `6.16.0`  
  - Used for candidate sign-in (required to apply for jobs)
- **Email Service:** Resend `4.3.0`  
  - Handles job alert subscription emails

### 🔹 Hosting
- **Platform:** [Vercel](https://vercel.com)

---

## 🚀 Major Features

### ✅ Public Job Listings
- All visitors can browse job listings and view detailed job pages without needing to sign in.

### 🔐 Candidate Authentication (via Clerk)
- Candidates must sign in using Clerk to apply to jobs.
- Sign-in is **not required** for browsing jobs or posting them.

### 📝 Open Job Posting
- Any user can post a job without authentication.
- Designed for maximum ease-of-use and low friction for companies/startups.

### 🔎 Advanced Search Filters
Search functionality includes:
- **Text Search** (Job Title, Description)
- **Location Type** (Remote, On-site, Hybrid)
- **Role Type** (Full-time, Part-time, Contract)
- **Experience Level**
- **Location** (City, Country)
- **Salary Range** (Minimum / Maximum)

### 📩 Job Alerts
- Users can subscribe to job alerts with a single click.
- On subscription:
  - A confirmation email is sent using Resend.
  - Subscription data is saved in Supabase for internal use.

---

## 🧰 Special Libraries & Tools

| Library        | Purpose                                              |
|----------------|------------------------------------------------------|
| **Clerk**      | User authentication for candidates                   |
| **Resend**     | Job alert email service                              |
| **Zod**        | Runtime validation of forms and API inputs           |
| **jose**       | JWT handling (for secure token processing)           |
| **lodash**     | Data manipulation and utility functions              |
| **date-fns**   | Lightweight date manipulation and formatting         |
| **react-email**| Create React-based dynamic email templates           |

---

## 🔍 Unique Implementation Notes

- 🧑‍💻 **Candidate sign-in is enforced only for applying to jobs**, not for browsing or job posting.
- 🛠 **Job postings are open** and frictionless to encourage quick listings.
- ⚡ **Optimized for performance** via server components and static site generation (Next.js).
- 🎨 **Tailwind CSS** used extensively to maintain consistent UI/UX design.
- 📬 **Job Alert Email Integration** with Resend + Supabase ensures seamless experience for candidates.

---

## File Structure


---

## 🧭 Roadmap Ideas (Optional)
_You can fill this section as the project evolves._

- [ ] Admin dashboard for job moderation
- [ ] Employer accounts and job management
- [ ] Job alert preferences (frequency, type)
- [ ] Analytics for job posters

---

