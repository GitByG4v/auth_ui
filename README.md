# SecureAuth — Enterprise-Grade React & TypeScript Authentication System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interview-ready, frontend-only authentication application built with **React 19**, **TypeScript** (Strict Mode), **Tailwind CSS**, **React Router v7**, **React Hook Form**, and **Zod**. Features a bespoke **Terracotta Frosted Glassmorphism** design system, an interactive binary matrix canvas, client-side Web Crypto API salted hashing, a real-time entropy-based password analyzer, and a CSPRNG password generator.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Architecture](#-project-architecture)
- [📋 Technical Requirements Verification](#-technical-requirements-verification)
- [📱 Responsive Design Matrix](#-responsive-design-matrix)
- [🔐 Security Architecture](#-security-architecture)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [📜 Git Workflow & Commit Guidelines](#-git-workflow--commit-guidelines)

---

## ✨ Key Features

### 1. Robust Authentication & Session Flow
- **Registration**: Multi-field validation with live password strength analysis and matching password confirmation.
- **Login**: Credential verification with toggleable session persistence (`localStorage` for "Remember me" vs `sessionStorage` for temporary sessions).
- **Forgot Password**: Password reset request simulation with copyable temporary reset tokens.
- **Protected Dashboard**: Route-guarded user dashboard presenting user profile details, active session indicators, and clean session termination.

### 2. Client-Side Cryptography & Security
- **Salted SHA-256 Hashing**: Passwords are never stored in plaintext. Hashing is performed using browser-native `crypto.subtle.digest('SHA-256', ...)`.
- **CSPRNG Password Generator**: Uses `window.crypto.getRandomValues()` with Fisher-Yates cryptographically secure shuffle. Supports custom character sets (uppercase, lowercase, numbers, symbols) and multi-word passphrases.
- **Real-Time Password Strength Engine**: Evaluates password complexity, character diversity, dictionary penalties, and calculates offline cracking resistance.

### 3. Terracotta Glassmorphic Design & Dark Mode
- **Custom Brand Identity**: Warm Terracotta (`#D97757`) with frosted backdrop filters (`backdrop-filter: blur(28px)`).
- **Zero-Blue Obsidian Dark Mode**: High-contrast, warm obsidian surfaces (`#131110`) preventing eye fatigue.
- **Theme Persistence**: Theme state persists across reloads and syncs with `localStorage`.
- **Interactive Matrix Background**: Hardware-accelerated canvas animation with hover glow effects.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Functional components, Hooks, StrictMode |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) | 100% strict type safety, zero `any` types |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + Modern CSS | Utility classes + custom CSS design tokens |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) | Declarative client-side routing & route guards |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Schema-driven validation & accessible error states |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |
| **Security** | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) | Native CSPRNG & SHA-256 cryptographic digest |
| **Build Tool** | [Vite](https://vitejs.dev/) | Ultra-fast HMR and optimized production bundling |

---

## 📁 Project Architecture

```
auth_ui/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable, accessible UI components
│   │   ├── AuthLayout.tsx            # Glassmorphic auth card shell
│   │   ├── Button.tsx                # Polymorphic button with loading states
│   │   ├── FormInput.tsx             # Accessible text/email input with icons
│   │   ├── PasswordInput.tsx         # Password input with visibility toggle
│   │   ├── PasswordStrengthMeter.tsx # Real-time strength meter & checklist
│   │   ├── PasswordGenerator.tsx     # CSPRNG password & passphrase generator
│   │   ├── MatrixBackground.tsx      # Interactive canvas animation
│   │   ├── ThemeToggle.tsx           # Light/Dark mode switch
│   │   └── ProtectedRoute.tsx        # Auth state route guard
│   ├── context/            # Global React Context providers
│   │   ├── AuthContext.tsx           # User authentication & session state
│   │   └── ThemeContext.tsx          # Theme state & HTML class manager
│   ├── pages/              # Application route views
│   │   ├── Login.tsx                 # Sign-in page
│   │   ├── Register.tsx              # Account registration page
│   │   ├── ForgotPassword.tsx        # Password reset request page
│   │   └── Dashboard.tsx             # Authenticated user dashboard
│   ├── services/           # Data & persistence layer
│   │   └── authService.ts            # Web Crypto SHA-256 storage service
│   ├── types/              # Centralized TypeScript definitions
│   │   └── auth.ts                   # Interfaces for User, Session, Theme, etc.
│   ├── utils/              # Pure utility functions
│   │   ├── validation.ts             # Zod schemas & inferred TypeScript types
│   │   ├── passwordStrength.ts       # Strength analyzer & crack time estimator
│   │   └── passwordGenerator.ts      # CSPRNG generator & secure shuffle
│   ├── App.tsx             # Root router configuration
│   ├── main.tsx            # Application entry point
│   ├── index.css           # Tailwind CSS import, tokens, and responsive styles
│   └── vite-env.d.ts       # Vite client types definition
├── index.html              # HTML shell
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # Strict TypeScript compiler options
└── vite.config.ts          # Vite configuration with Tailwind CSS plugin
```

---

## 📋 Technical Requirements Verification

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **React.js with TypeScript** | Fully configured `tsconfig.json` (strict: true). All `.jsx`/`.js` files migrated to `.tsx`/`.ts`. Types defined in `src/types/auth.ts`. | ✅ Verified (`tsc --noEmit` code 0) |
| **Tailwind CSS Integration** | Tailwind CSS v4 configured with `@tailwindcss/vite` plugin and `@import "tailwindcss";` in `src/index.css`. | ✅ Verified |
| **Functional Components & Hooks** | 100% functional components using `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useId`, and custom context hooks. | ✅ Verified |
| **Proper Component Architecture** | Clear separation between reusable components, page views, services, contexts, and pure utilities. | ✅ Verified |
| **Clean & Readable Code** | Consistent formatting, descriptive naming, clean comments without AI boilerplate. | ✅ Verified |
| **Validation & Error Handling** | Zod schemas with React Hook Form resolver. Accessible ARIA alerts (`role="alert"`, `aria-invalid`). | ✅ Verified |
| **Responsive UI** | Mobile-first CSS breakpoints covering small mobile (`<= 480px`), tablet (`<= 768px`), and desktop. Zero horizontal overflow. | ✅ Verified |

---

## 📱 Responsive Design Matrix

The application is engineered to provide an optimal experience across all device viewports:

| Breakpoint | Target Devices | Adaptive Behaviors |
| :--- | :--- | :--- |
| **`< 480px`** | Mobile Phones (iPhone SE, Galaxy S, Pixel) | Card padding scales down to `1.5rem 1rem`. Auth badge scales to `50px`. Navbar collapses user email and text labels for clean layout. Dashboard details stack vertically with `word-break: break-all`. Generator switches to 1-column layout. |
| **`481px - 768px`** | Phablets & Small Tablets (iPad Mini, Surface) | Dashboard hero adjusts to column layout. Navbar user name truncated with ellipsis. Card width constrained with proportional padding. |
| **`> 768px`** | Tablets & Desktop Displays | Full two-column generator options, horizontal profile cards, spacious hero section, and floating/fixed theme toggles. |

---

## 🔐 Security Architecture

```
[User Input] 
     │
     ▼
[Zod Schema Validation] 
     │ (Valid Input)
     ▼
[Web Crypto SHA-256 Digest]
     │ (Salt + Input) -> Subtitle digest -> Hex encoding
     ▼
[authService Storage Layer]
     │
     ├── "Remember Me" Checked   ──▶ localStorage (Persistent)
     └── "Remember Me" Unchecked ──▶ sessionStorage (Ephemeral)
```

1. **Client-Side Hashing**:
   Uses `crypto.subtle.digest('SHA-256', ...)` with individual salts before storing credentials in browser storage.
2. **CSPRNG Randomness**:
   Password generation relies strictly on `crypto.getRandomValues()` rather than `Math.random()`, ensuring cryptographically unpredictable outputs.
3. **Entropy Analysis**:
   Calculates pool size $R$ and password length $L$ to compute entropy in bits:
   $$E = L \times \log_2(R)$$
   Penalties are deducted for sequential characters, repeated patterns, and common dictionary sequences.

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm` or `yarn` / `pnpm`

### Step 1: Clone the Repository
```bash
git clone https://github.com/GitByG4v/auth_ui.git
cd auth_ui
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 4: Run Type Check
```bash
npx tsc --noEmit
```

### Step 5: Build for Production
```bash
npm run build
```
The optimized bundle will be generated in the `dist/` directory.

---

## 📜 Git Workflow & Commit Guidelines

This project follows a clean, descriptive Git commit history aligned with the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features or user-facing functionality
- `fix:` Bug fixes or UI issue resolutions
- `refactor:` Code improvements without changing functionality (e.g., TypeScript conversion)
- `style:` Styling updates, responsive improvements, CSS tokens
- `docs:` Documentation updates and README enhancements
- `chore:` Tooling, configuration, or dependency updates

### Recommended Commit Commands
```bash
# Check modified and untracked files
git status

# Stage all updated files
git add .

# Commit with a meaningful message
git commit -m "feat: complete TypeScript migration, Tailwind integration, responsive polish and README"

# Push to your GitHub repository
git push origin main
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
