type Sort = "newest" | "oldest";
type IssueType = "bug" | "feature_request";
type Status = "open" | "in_progress" | "resolved";
type UserRole = 'contributor' | 'maintainer';

export interface IssueQuery {
  sort?: Sort;
  type?: IssueType;
  status?: Status;
}

//Reporter Response
export interface IIssueReporter {
  id: number;
  name: string;
  role: UserRole;
}

//Issue response
export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: Status;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

// All issue intotal response
export interface IIssueResponse {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status: Status;
  reporter: IIssueReporter | null;
  created_at: Date;
  updated_at: Date;
}
