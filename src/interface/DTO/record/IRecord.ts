export interface IRecord {
  _id: string;
  userId: string;
  date: Date;  
  startTime: string;
  endTime: string;
  studyDuration: number;
  createdAt: Date;
}
