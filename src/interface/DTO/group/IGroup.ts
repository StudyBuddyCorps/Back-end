export interface GroupMember {
  userId: string;
  role: 'admin' | 'member';
}

export interface GroupData {
  name: string;
  createdAt?: Date;
  members: GroupMember[];
}