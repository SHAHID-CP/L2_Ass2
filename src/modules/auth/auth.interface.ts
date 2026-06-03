
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'contributor' | 'maintainer';
}

export interface LoginUserInput{
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  role: 'contributor' | 'maintainer';
  created_at: Date;
  updated_at: Date;
}

export interface ILoginResponse {
  token: string;
  user: IUserResponse;
}