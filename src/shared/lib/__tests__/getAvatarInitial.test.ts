import { getAvatarInitial } from '../getAvatarInitial';

describe('getAvatarInitial', () => {
  it('uses the first letter of the name', () => {
    expect(getAvatarInitial('сергей', 'biomugus@mail.ru')).toBe('С');
  });

  it('falls back to the email when the name is empty', () => {
    expect(getAvatarInitial(null, 'biomugus@mail.ru')).toBe('B');
    expect(getAvatarInitial('   ', 'biomugus@mail.ru')).toBe('B');
  });

  it('returns "?" when nothing is available', () => {
    expect(getAvatarInitial(undefined, undefined)).toBe('?');
  });
});
