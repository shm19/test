export const calcDistance = (
  firstCoordination: number[],
  secondCoordination: number[],
): number => {
  const toRad = (value: number): number => (value * Math.PI) / 180;

  const [log1, lat1] = firstCoordination;
  const [log2, lat2] = secondCoordination;

  const R = 6371000; // metr
  const dLat: number = toRad(lat2 - lat1);
  const dLog: number = toRad(log2 - log1);
  const radLat1: number = toRad(lat1);
  const radLat2: number = toRad(lat2);

  const a: number =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLog / 2) *
      Math.sin(dLog / 2) *
      Math.cos(radLat1) *
      Math.cos(radLat2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance: number = R * c;
  return distance;
};

export const calcDegree = (
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number,
): number => {
  const result: number = (Math.atan2(lat2 - lat1, lng2 - lng1) * 180) / Math.PI;
  return result < 0 ? result + 360 : result;
};
