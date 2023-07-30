export interface NumberItem {
  country: string;
  number: string;
  source: string;
  [propName: string]: any;
}

export interface NumberDetail {
  curNumber: string;
  smsList: string[];
  taskId: string;
  refreshTimes: number;
}

export interface NotificationMsg {
  title: string,
  body: string,
  icon: string,
  [propName: string]: any;
}