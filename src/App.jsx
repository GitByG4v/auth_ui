import { ShieldCheck } from 'lucide-react'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '1.5rem',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        backgroundColor: '#f3f4f6',
        color: '#2563eb',
        marginBottom: '1rem'
      }}>
        <ShieldCheck size={32} />
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
        React Auth System
      </h1>
      <p style={{ color: '#6b7280', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
        Milestone 1 initialized: Vite, React Router, Zod, React Hook Form, and Vitest configured.
      </p>
    </div>
  )
}

export default App
