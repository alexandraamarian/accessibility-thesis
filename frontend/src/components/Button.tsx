import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseStyles =
    'rounded transition-all font-semibold adaptive-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';

  const variantStyles = {
    primary: 'bg-accent text-bg hover:opacity-90 active:opacity-80',
    secondary: 'bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-bg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        padding: 'var(--button-padding)',
        transitionDuration: 'var(--animate-duration)',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
