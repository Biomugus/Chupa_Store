// src/modules/auth/types/authTypes.ts

/**
 * Standardized auth action result.
 * Used by Server Actions to communicate success/error state to the client.
 */
export interface AuthActionResult {
  /** Human-readable error message to display in the form. */
  error?: string;
  /** Human-readable success message (e.g. "Check your email"). */
  success?: string;
  /** Per-field validation errors from Zod. */
  fieldErrors?: Record<string, string[]>;
}
