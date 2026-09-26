/**
 * First letter for a user avatar: taken from the name when present, otherwise from the email.
 */
export function getAvatarInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || '?';
  return source.charAt(0).toUpperCase();
}
