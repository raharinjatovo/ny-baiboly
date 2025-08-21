/**
 * Base Button component following Radix design system patterns
 * Secure, accessible, and highly customizable
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

/**
 * Button variant definitions using CVA for type-safe styling
 */
const buttonVariants = cva(
  // Base styles for all buttons
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary text-primary-foreground shadow',
          'hover:bg-primary/90',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground shadow-sm',
          'hover:bg-destructive/90',
        ],
        outline: [
          'border border-input bg-background shadow-sm',
          'hover:bg-accent hover:text-accent-foreground',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground shadow-sm',
          'hover:bg-secondary/80',
        ],
        ghost: [
          'hover:bg-accent hover:text-accent-foreground',
        ],
        link: [
          'text-primary underline-offset-4',
          'hover:underline',
        ],
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Button component props interface
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Whether to render as a child component (polymorphic) */
  asChild?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
}

/**
 * Button component with full accessibility support
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      icon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    // When using asChild, we need to render a single child element
    // The parent Link/element will handle the styling
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
              fill="currentColor"
            />
          </svg>
        )}
        {!loading && icon && <span className="shrink-0">{icon}</span>}
        {children}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
