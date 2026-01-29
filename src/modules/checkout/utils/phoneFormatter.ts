export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  let res = '+7 ';
  const mainDigits = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;

  if (mainDigits.length > 0) res += '(' + mainDigits.slice(0, 3);
  if (mainDigits.length > 3) res += ') ' + mainDigits.slice(3, 6);
  if (mainDigits.length > 6) res += '-' + mainDigits.slice(6, 8);
  if (mainDigits.length > 8) res += '-' + mainDigits.slice(8, 10);

  return res.trim();
};
