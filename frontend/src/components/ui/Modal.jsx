// src/components/ui/Modal.jsx
import { useEffect } from 'react'

/**
 * Generic modal overlay.
 * @param {object}   props
 * @param {boolean}  props.open        - Controls visibility
 * @param {Function} props.onClose     - Called when backdrop or X is clicked
 * @param {string}   [props.title]     - Modal heading
 * @param {string}   [props.subtitle]  - Modal subheading
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer]  - Footer slot (buttons etc.)
 */
export default function Modal({ open, onClose, title, subtitle, children, footer }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center min-h-screen p-4 sm:p-10"
    >
      <div
        className="bg-surface-container-lowest flex flex-col w-full max-h-[90vh] max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="font-headline text-2xl font-extrabold text-on-surface">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-on-surface-variant font-body mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1 max-h-[60vh]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-6 bg-surface-container-low/50 flex items-center justify-end gap-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}