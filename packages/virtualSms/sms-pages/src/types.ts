export interface NumberItem {
  country: string;
  number: string;
  source: string;
}

export interface NumberDetail {
  curNumber: string;
  smsList: string[];
  taskId: string;
  refreshTimes: number;
}