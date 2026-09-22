import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className="field">
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label}
        </label>
      )}
      <input id={inputId} className={`field__input ${className}`.trim()} {...props} />
    </div>
  )
}
