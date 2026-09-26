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
  /**
   * Non-secret values the user submitted. React 19 resets a form after its
   * action runs, so these are fed back as `defaultValue` to survive the reset.
   */
  values?: { email?: string; fullName?: string };
}
