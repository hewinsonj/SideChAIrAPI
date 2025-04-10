
# 🧠 SideChAIr – AI-Powered Mental Health Companion

SideChAIr is a secure, cross-platform application for therapists and patients to track, analyze, and reflect on therapeutic progress. It combines microphone-based session logging, structured journaling, AI insights, and clean UX to support better care and self-awareness.

---

## 📌 Overview

This app empowers both therapists and patients by offering:

- Secure therapist and patient accounts
- Microphone-driven session recording and transcription (Whisper API)
- AI-powered conversation summaries and topic analysis (OpenAI GPT)
- Session notes, life context data, and journaling tools
- Weekly AI reflection prompts (rate-limited)
- Patient session ratings (alongside therapist and AI scoring)
- Role-based access (therapist sees full data, patient sees filtered content)
- Journal entries with private and shared visibility
- Optional offline mode via Electron
- Scalable model for paid subscriptions and usage-based limits

---

## ✅ User Stories

### Therapist

- Sign in securely and manage my client list
- Record therapy sessions and transcribe them
- View and edit session transcripts and AI summaries
- Tag themes, rate sessions, and identify patterns
- View shared patient journals and notes
- Keep private notes and see AI interpretation over time

### Patient

- Sign in and view a timeline of past sessions
- See therapist-shared transcripts and summaries
- Add shared and private notes to sessions
- Write independent journal entries
- Once a week, request an AI analysis of my recent journal entries
- Rate my sessions (mood, stress, energy)
- Search journal entries by date or tag
- Reflect using personalized AI-generated summaries

---

## 🧱 ERD – Core Models (with Versioning)

_(Truncated: refer to original ERD file for detailed structure)_

---

## 📓 Journaling System

- Free-form journal entries
- 🔒 Private or 👥 Shared
- Searchable by date or tag
- AI-generated weekly reflections

---

## 🧠 AI Intelligence System

- Transcription: Whisper
- Summaries, themes, tone: GPT-3.5
- Normalized theme matching for consistency

---

## 📊 Ratings & Insights

Therapist + Patient + AI scoring (1–10 scale on mood, stress, energy)  
Editable therapist ratings and AI summaries

---

## 📋 Life Context per Patient

1. Occupation / Schooling
2. Goals / Ambitions
3. Identity Factors (voluntary)
4. Relationship Status
5. Hobbies & Creative Outlets
6. Significant Life Events
7. Mental Health History
8. Substance Use
9. Living Situation
10. Physical health & sleep

---

## 🔐 Roles & Access Matrix

| Feature                            | Therapist | Patient |
|------------------------------------|-----------|---------|
| View all sessions                  | ✅        | ✅      |
| Create sessions                    | ✅        | ❌      |
| View/edit life context             | ✅        | ❌      |
| Add private/shared session notes   | ✅        | ✅      |
| Create journal entries             | ❌        | ✅      |
| Weekly AI journal analysis         | ❌        | ✅      |
| Edit AI summaries or ratings       | ✅        | ❌      |
| View private therapist notes       | ❌        | ❌      |
| View shared notes + summaries      | ✅        | ✅      |
| Rate session (mood/stress/energy)  | ✅        | ✅      |

---

## ⚙ Deployment Modes

| Mode         | Features                                           |
|--------------|----------------------------------------------------|
| Web PWA      | Installable mobile/desktop, cloud-connected        |
| Electron     | Desktop only, full local DB + offline support      |
| Shared Mongo | Hosted Atlas DB or local test DB fallback          |

---

## 💰 Cost & Monetization

| Feature                    | Free Tier   | Premium Tier         |
|----------------------------|-------------|------------------------|
| Whisper Transcription      | Flagged only| Unlimited              |
| AI Weekly Journal Summary  | 1x/week     | Unlimited              |
| AI Chat (future)           | ❌          | ✅                     |
| Export Tools               | PDF only    | PDF/CSV/JSON           |
| Session AI Summaries       | Flagged only| Auto-analyze all       |

---

## 🔐 Data Security

- AES-based field encryption (`mongoose-field-encryption`)
- Key stored via `ENCRYPTION_SECRET` in `.env`
- Role-based access control (therapist vs. patient)
- No audio stored by default
- Electron support for local encryption

---

## 🧰 Dev Setup

```bash
# Backend
cd server && npm install && npm run dev

# Frontend
cd client && npm install && npm start

# Electron (optional)
cd electron && npm install && npm start
```

`.env` should include: `MONGODB_URI`, `OPENAI_API_KEY`, `ENCRYPTION_SECRET`

---

## 📄 License

Codebase: GNU GPLv3  
Planning & content © 2025 Justin Hewinson  
Contact: [your email or placeholder]
