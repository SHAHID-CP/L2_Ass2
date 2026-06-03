import { pool } from "../../db";
import type { IssueQuery } from "./issues.interface";

// 1 Issue create
export const createIssue = async (title: string,description: string,type: string,reporter_id: number)=> {

    const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporter_id]
  );
  return result.rows[0];
};



// GET All issue with (filter + sort)
export const getAllIssues = async (query:IssueQuery) => {
  const { sort, type, status } = query;

  let queryText = 'SELECT * FROM issues WHERE 1=1';
  const queryParams: any[] = [];

  if (type) {
    queryParams.push(type);
    queryText += ` AND type = $${queryParams.length}`;
  }
  if (status) {
    queryParams.push(status);
    queryText += ` AND status = $${queryParams.length}`;
  }
  queryText += sort === 'oldest' ? ' ORDER BY created_at ASC' : ' ORDER BY created_at DESC';
  
  //Query onosare all issue collect
  const issuesResult = await pool.query(queryText, queryParams);
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];
  //Issue er moddhe theke jara report korse tader id collect[1,2,2,3,4,4]
  const reporterId = issues.map((issue) => issue.reporter_id);
  
  //jara report korse sey user golo collect
  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`, // Any array expected kore array jonno any use kortesi
    [reporterId]
  );

  const users = usersResult.rows;
  const fullData = issues.map((issue) => {

    //Issue er sathe reporter user er data jog kore return
    const reporterData = users.find((user) => user.id === issue.reporter_id);
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: reporterData || null ,
      created_at: issue.created_at,
      updated_at: issue.updated_at
    };
  });
  return fullData;
};

// Get single issue
export const findIssueById = async (id: number) => {
  const issueRes = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
  if (issueRes.rows.length === 0) return null;
  const issue = issueRes.rows[0];

  const userRes = await pool.query('SELECT id, name, role FROM users WHERE id = $1', [issue.reporter_id]);
  

  return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: userRes.rows[0] || null ,
      created_at: issue.created_at,
      updated_at: issue.updated_at   
  };
};



// Issue update
export const updateIssue = async (id: number, updates: any) => {
  const { title, description, type ,status} = updates;
  if(status){
    const result= await pool.query(
    `UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), status = COALESCE($4, status), updated_at = NOW() 
     WHERE id = $5 RETURNING *`,
    [title, description, type, status, id]
  );
  return result.rows[0] || null;
  }else{
    const result2= await pool.query(
    `UPDATE issues SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), updated_at = NOW() 
     WHERE id = $4 RETURNING *`,
    [title, description, type, id]
    );
    return result2.rows[0] || null;
  }

};

// Raw issue get
export const getRawIssue = async (id: number) => {
  const res = await pool.query('SELECT * FROM issues WHERE id = $1', [id]);
  return res.rows[0] || null;
};

// Issue delete
export const deleteIssue = async (id: number)=> {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1`,
    [id]
  );
  return result;
};