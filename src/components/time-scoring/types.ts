export type TTask = {
  id: number;
  description: string;
  employee: string;
  complexity: number;
  [key: string]: any;

  startDate?: number;
  finishDate?: number;
  realFinishDate?: number;
}
