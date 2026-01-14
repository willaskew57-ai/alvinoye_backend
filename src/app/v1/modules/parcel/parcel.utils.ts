/**
 * Generate a unique human-readable Parcel ID (e.g., PC-1715432)
 */
export const generateParcelId = (): string => {
  const randomPart = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `PC-${randomPart}`;
};
