export type TReport = {
  id: string;
  name: string;
  description: string;
  mileage: {
    last: number;
    delta: number;
  }
  diff: number;
}
