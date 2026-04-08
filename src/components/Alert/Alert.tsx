import React from 'react'
import './Alert.css'

type AlertType = 'success' | 'error' | 'warning' | 'info'

export interface AlertProps {
  type?: AlertType
  title: string
  description?: string
  onClose?: () => void
}

const icons: Record<AlertType, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8"/><path d="M6.5 10.5l2.5 2.5 4-5"/>
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8"/><path d="M10 6.5v4M10 13.5h.01"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3L2.5 16h15L10 3z"/><path d="M10 8.5v3.5M10 14.5h.01"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8"/><path d="M10 9.5v5M10 6.5h.01"/>
    </svg>
  ),
}

export default function Alert({ type = 'info', title, description, onClose }: AlertProps) {
  return (
    <div className="alert-container">
      <div className={`alert alert-${type}`}>
        <span className={`alert__icon alert__icon--${type}`}>
          {icons[type]}
        </span>
        <div style={{ flex: 1 }}>
          <p className={`alert__title alert__title--${type}`}>{title}</p>
          {description && (
            <p className="alert__description">{description}</p>
          )}
        </div>
        {onClose && (
          <button className="alert__close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}