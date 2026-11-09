# React Authentication System

An interview-grade, frontend-only authentication application built with React, Vite, React Router, Context API, React Hook Form, and Zod.

## Features Overview
- **Authentication Flows**: Register, Login, Simulated Forgot Password, and Protected Dashboard.
- **Signature Security Tools**:
  - Live Password Strength Analyzer (entropy checklist, crack effort estimate, pattern detection).
  - Secure Password Generator powered by the native Web Crypto API (`crypto.getRandomValues()`).
- **Clean Architecture**: Pluggable mock `authService` decoupling UI components from browser storage and backend transport.
- **Route Guarding**: Protected routes with session restoration on page reload and post-login redirection.

## Tech Stack
- **Framework & Bundler**: React 19 + Vite
- **Routing**: React Router DOM (v7)
- **State Management**: React Context API
- **Form & Validation**: React Hook Form + Zod (`@hookform/resolvers`)
- **Icons**: Lucide React
- **Styling**: Plain modern CSS (Custom Properties / Design Tokens)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
