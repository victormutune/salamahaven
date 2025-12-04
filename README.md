
# Salamahaven 🌍✨  
> A secure, multilingual digital-violence reporting platform — empowering survivors with safe reporting, community support, and professional help.

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_BADGE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE/deploys)

Live Demo: https://salamahaven.netlify.app/

---

## 🛡️ About The Project
Digital violence is a rising crisis — many survivors have no safe space to report, store evidence, or seek help. **Salamahaven** was created to offer a secure, survivor-centered digital support platform with:

✔ Anonymous incident reporting  
✔ Professional counseling connections  
✔ Supportive community forums  
✔ Emergency assistance tools  
✔ Multilingual accessibility  

The platform prioritizes **privacy, security, and inclusivity**.

---

## 🛠️ Built With
| Category | Technologies |
|---------|--------------|
| Frontend | React 18.2 + TypeScript, Vite |
| UI | Tailwind CSS, Radix UI / Shadcn UI, Framer Motion |
| Backend | Supabase (Authentication + Database) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Localization | i18next (En, Sw, Kikuyu, Kamba, Luhya, Luo) |
| Maps | Leaflet + React-Leaflet |
| State | React Context API |

---

## 🚦 Key Features
### 🔒 Incident Reporting
- Anonymous option  
- Secure data storage  
- Upload digital evidence

### 🧑‍⚕️ Counseling & Safety Support
- Verified counselors
- Map with safe centers
- Emergency quick-exit button

### 💬 Community Interaction
- Share stories + seek advice
- Post moderation + editing
- Like/comment functionality

### 🌍 Accessibility & Multilingual
- 6 supported local languages
- Screen reader friendly
- Light/Dark mode

### 🧑‍💼 Admin Dashboard
- Role-based permissions
- User + report management

### 📱 Modern Experience
- Mobile-first design
- PWA support (installable)
- Smooth animations

---

## 📂 Project Structure

```

salamahaven/
├── src/
│   ├── components/
│   │     ├── layout/
│   │     ├── counselors/
│   │     ├── ui/
│   ├── contexts/
│   ├── lib/
│   │     └── supabase.ts
│   ├── locales/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── public/
└── ...

````

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Installation
```bash
git clone https://github.com/yourusername/salamahaven.git
cd salamahaven
npm install
````

Create a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the project:

```bash
npm run dev
```

Your app opens at:
➡ [http://localhost:5173](http://localhost:5173)

---

## 📦 Scripts

| Script            | Description        |
| ----------------- | ------------------ |
| `npm run dev`     | Development server |
| `npm run build`   | Production build   |
| `npm run preview` | Preview prod build |
| `npm run lint`    | ESLint code check  |

---



## 🧭 Roadmap

* [x] Secure incident reporting (MVP)
* [x] User authentication (Supabase)
* [x] Multilingual support
* [ ] Admin dashboard full functionality
* [ ] Real-time chat with counselors
* [ ] Community safety moderation tools
* [ ] AI-powered legal advisory assistant

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your branch
5. Submit a pull request

---

## 📄 License

Distributed under the **MIT License**.
See `LICENSE` for more details.

---

## 📞 Contact & Support

Have suggestions or feedback?
Open an issue or contact the development team.


Live Project: [https://salamahaven.netlify.app/](https://salamahaven.netlify.app/)
GitHub: [https://github.com/yourusername/salamahaven](https://github.com/yourusername/salamahaven)





