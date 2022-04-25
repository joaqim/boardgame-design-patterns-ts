/* eslint-disable unicorn/no-zero-fractions */
/* eslint-disable prettier/prettier */
export const TalismanNodeLayoutPixelPosition = Object.freeze([
  [400, 255],
  [1000, 240],
  [1650, 240],
  [2300, 240],
  [2930, 240],
  [3580, 240],
  [4200, 255],
  [4275, 660],
  [4275, 1170],
  [4275, 1640],
  [4275, 1980],
  [4275, 2350],
  [4200, 2750],
  [3575, 2760],
  [2925, 2760],
  [2255, 2760],
  [1650, 2760],
  [1000, 2760],
  [400, 2740],
  [275, 2355],
  [275, 1940],
  [275, 1535],
  [275, 1110],
  [275, 700],
  [840, 710],
  [1550, 710],
  [2300, 710],
  [3060, 710],
  [3760, 710],
  [3830, 1135],
  [3830, 1545],
  [3830, 1920],
  [3760, 2310],
  [3020, 2300],
  [2300, 2300],
  [1530, 2300],
  [840, 2290],
  [780, 1920],
  [780, 1545],
  [780, 1135],
  [3150, 1900],
  [2335, 1900],
  [1420, 1900],
  [1200, 1510],
  [3390, 1520],
  [3165, 1140],
  [2335, 1135],
  [1420, 1140],
  [2330, 1515]
]);

export const TalismanNodeLayoutRelativePosition = Object.freeze(
  Array.from({ length: 49 }, (_v, index) => {
    const width = 4581;
    const height = 3026;
    const pos = TalismanNodeLayoutPixelPosition[index];
    return [
      Number.parseFloat((pos[0] / width).toFixed(3)),
      Number.parseFloat((pos[1] / height).toFixed(3))
    ];
  })
);
