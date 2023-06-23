import { createHmac } from 'node:crypto';

export const MAIN_KEY = 'westlife';

export const convertToSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const ApiKeyGenerator = () => {
  return 'CFxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const HashValue = (value: string) => {
  const algorithm = 'sha512';
  const SecretKey = 'humongoussecretkey';

  return createHmac(algorithm, SecretKey).update(value).digest('hex');
};
