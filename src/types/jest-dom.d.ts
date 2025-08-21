/**
 * Jest DOM type declarations
 * Extends Jest matchers with DOM testing utilities
 */

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toBeEnabled(): R;
      toBeDisabled(): R;
      toBeChecked(): R;
      toHaveValue(value: string | number | string[]): R;
      toHaveDisplayValue(value: string | RegExp | string[] | RegExp[]): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toHaveTextContent(text: string | RegExp): R;
      toContainElement(element: HTMLElement | null): R;
      toHaveAccessibleName(name?: string | RegExp): R;
      toHaveAccessibleDescription(description?: string | RegExp): R;
      toHaveRole(role: string): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toHaveErrorMessage(message?: string | RegExp): R;
      toHaveFocus(): R;
      toHaveFormValues(values: Record<string, any>): R;
      toBePartiallyChecked(): R;
      toHaveSelectedOptions(options: HTMLElement[] | HTMLElement | string[] | string): R;
    }
  }
}
