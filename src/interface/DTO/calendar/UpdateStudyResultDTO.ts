export interface UpdateStudyResultRequest {
  userId: string;
  year: number;
  month: number;
  data: StudyResultDTO;
}

export interface StudyResultDTO {
  feedList: Feedback[];
  totalTime: number;
  realTime: number;
  advice: string;
}

export interface Feedback {
  content: string;
  createdAt: Date;
}
