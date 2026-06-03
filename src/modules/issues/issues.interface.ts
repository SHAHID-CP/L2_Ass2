type Sort = "newest" | "oldest";
type IssueType = "bug" | "feature_request";
type Status = "open" | "in_progress" | "resolved";

export interface IssueQuery {
  sort?: Sort;
  type?: IssueType;
  status?: Status;
}