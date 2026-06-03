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