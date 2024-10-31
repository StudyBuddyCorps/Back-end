export interface GroupMember {
  userId: string;
  role: 'admin' | 'member';
}

export interface GroupData {
  name: string;
  description: string;
  goalStudyTime: number;
  createdAt?: Date;
  members: GroupMember[];
}