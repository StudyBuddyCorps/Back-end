export interface SignupLocalRequest {
  email: string;
  password: string;
  comparePassword: string;
  nickname: string;
}

export interface SignupSocialRequest {
  email: string;
  nickname: string;
  profileUrl: string;
  provider: string;
}
