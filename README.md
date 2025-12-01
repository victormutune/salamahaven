# SalamaHaven - Digital Violence Reporting Platform

![SalamaHaven Banner](https://via.placeholder.com/1200x300?text=SalamaHaven+Platform)

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
[![React](https://img.shields.io/badge/react-18.2.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0.2-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-4.3.2-yellow)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.3.2-38bdf8)](https://tailwindcss.com/)

</div>

---

<p align="center">
  <strong>SalamaHaven</strong> is a secure, anonymous, and comprehensive platform designed to empower survivors of digital violence. It provides a safe space for reporting incidents, accessing professional counseling, and connecting with a supportive community.
    <br />
    <a href="#key-features"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#getting-started">View Demo</a>
    ·
    <a href="https://github.com/yourusername/salamahaven/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/salamahaven/issues">Request Feature</a>
</p>

## 📋 Table of Contents

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## 💡 About The Project

Digital violence is a growing concern, and victims often lack a safe, anonymous way to report incidents or seek help. **SalamaHaven** bridges this gap by offering a unified platform that combines reporting tools, community support, and professional counseling resources.

### Built With

*   [![React][React.js]][React-url]
*   [![TypeScript][TypeScript]][TypeScript-url]
*   [![Vite][Vite]][Vite-url]
*   [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]
*   [![Supabase][Supabase]][Supabase-url]
*   [![Leaflet][Leaflet]][Leaflet-url]
*   [![Shadcn UI][Shadcn]][Shadcn-url]

## 🌟 Key Features

### 🛡️ Secure & Anonymous Reporting
- **End-to-End Encryption**: Reports are encrypted to ensure data privacy.
- **Anonymous Option**: Users can report incidents without revealing their identity.
- **Evidence Upload**: Securely upload screenshots and documents.

### 👮 Admin Dashboard
- **Role-Based Access**: Dedicated portal for admins.
- **Report Management**: Review, update status, and take action on reports.
- **User Management**: Manage user accounts and permissions.

### 💬 Community Support
- **Safe Space**: Share stories and ask for advice in a moderated environment.
- **Interaction**: Like, share, and comment on posts.
- **Content Control**: Users can delete their own posts and comments.

### 📍 Professional Counseling & Safety
- **Find Counselors**: Interactive map to find verified counselors and clinics.
- **Emergency Assistance**: One-tap access to emergency contacts and "Quick Exit" feature.
- **Safe Centers**: Locate nearest physical safe spaces with real-time distance calculation.

### 📱 Modern & Accessible
- **PWA Support**: Installable on mobile and desktop with offline capabilities.
- **Dark Mode**: Fully supported dark theme.
- **Responsive Design**: Optimized for all screen sizes (Mobile, Tablet, Desktop).
- **Internationalization**: English and Swahili support.

## 📸 Screenshots

| Landing Page | Dashboard |
|:---:|:---:|
| ![Landing Page](https://via.placeholder.com/400x200?text=Landing+Page) | ![Dashboard](https://via.placeholder.com/400x200?text=Dashboard) |

| Mobile View | Map View |
|:---:|:---:|
| ![Mobile View](https://via.placeholder.com/200x400?text=Mobile) | ![Map View](https://via.placeholder.com/400x200?text=Map+View) |

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/salamahaven.git
    cd salamahaven
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```
salamahaven/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # Navbar, Footer, etc.
│   │   ├── ui/             # Shadcn UI components
│   │   └── ...
│   ├── lib/                # Utilities and API services
│   │   ├── api/            # API calls (emergency, etc.)
│   │   └── supabase.ts     # Supabase client
│   ├── pages/              # Application pages (Routes)
│   ├── App.tsx             # Main App component & Routing
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── ...
```

## 🔨 Usage

- **`npm run dev`**: Start the development server.
- **`npm run build`**: Build the application for production.
- **`npm run preview`**: Preview the production build locally.
- **`npm run test`**: Run the test suite.
- **`npm run lint`**: Run ESLint to check for code quality issues.

## 🗺️ Roadmap

- [x] Core Reporting Functionality
- [x] Admin Dashboard
- [x] Community Forum
- [x] Interactive Map for Counselors
- [x] Dynamic Emergency Page
- [ ] Real-time Chat with Counselors
- [ ] AI-powered Legal Advice Bot
- [ ] Multi-language Support Expansion

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Project Link: [https://github.com/yourusername/salamahaven](https://github.com/yourusername/salamahaven)

## 🙏 Acknowledgments

*   [Shadcn UI](https://ui.shadcn.com/)
*   [Lucide Icons](https://lucide.dev/)
*   [React Leaflet](https://react-leaflet.js.org/)
*   [Supabase](https://supabase.com/)

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E
[Vite-url]: https://vitejs.dev/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Supabase]: https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E
[Supabase-url]: https://supabase.com/
[Leaflet]: https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white
[Leaflet-url]: https://leafletjs.com/
[Shadcn]: https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white
[Shadcn-url]: https://ui.shadcn.com/
