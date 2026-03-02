export const generateParcelId = (): string => {
  const randomPart = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `PC-${randomPart}`;
};
