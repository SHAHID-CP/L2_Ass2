import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {createIssue,getAllIssues,updateIssue,deleteIssue, findIssueById, getRawIssue,} from './issues.service';
import { AppError, sendError, sendSuccess } from '../../utility/sendResponse';
import { USER_ROLE } from '../../types';



// 1 POST /api/issues
export const createIssueHandler = async (req: Request,res: Response, next: NextFunction) => {
  const { title, description, type } = req.body;
  const reporter_id = req.user?.id;

    //Validation
  if (!title || !description || !type) throw new AppError(StatusCodes.BAD_REQUEST, 'title, description, type required');
  if (title.length > 150) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid title (max 150 chars)');
  if (description.length < 20) throw new AppError(StatusCodes.BAD_REQUEST, 'Description must be at least 20 chars');
  if (!['bug', 'feature_request'].includes(type)) throw new AppError(StatusCodes.BAD_REQUEST, 'type must be bug or feature_request');
  if (!reporter_id) throw new AppError(StatusCodes.UNAUTHORIZED,"Reporter id not found")


  try {
    const issue = await createIssue(title, description, type, reporter_id as number);
    return sendSuccess(res, StatusCodes.CREATED, 'Issue created successfully', issue);
  } catch (err) {
    return next(err);
  }
};



// 2 GET /api/issues
export const getAllIssuesHandler = async (req: Request,res: Response, next: NextFunction) => {
  const { sort, type, status }  = req.query

  // Query param validation
  if(sort && !["newest", "oldest"].includes(sort as string)) throw new AppError(StatusCodes.BAD_REQUEST, 'sort must be newest or oldest');
  if (type && !['bug', 'feature_request'].includes(type as string)) throw new AppError(StatusCodes.BAD_REQUEST, 'type must be bug or feature_request');
  if (status && !['open', 'in_progress', 'resolved'].includes(status as string)) throw new AppError(StatusCodes.BAD_REQUEST, 'status must be open, in_progress or resolved');

  try {
    const data = await getAllIssues(req.query);
    return sendSuccess(res,StatusCodes.OK,"Issues retrived successfully",data);
  } catch (err) {
    return next(err);
  }
};



// 3 GET /api/issues/:id
export const getIssueByIdHandler = async (req: Request,res: Response, next: NextFunction)=> {

  // validation cheack
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid issue ID');

  try {
    const data = await findIssueById(id);
    if (!data) throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
    return sendSuccess(res, StatusCodes.OK, 'Issue retrived successfully', data);

  } catch (err) {
    return next(err);
  }
};




// 4 PATCH /api/issues/:id
export const updateIssueHandler = async (req: Request,res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id as string);
  const { title, description, type, status } = req.body;
  const user = req.user;

  if (isNaN(id)) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid issue ID');
   
  if (title && title.length > 150) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid title (max 150 chars)');
  if (description && description.length < 20) throw new AppError(StatusCodes.BAD_REQUEST, 'Description must be at least 20 chars');
  if (type && !['bug', 'feature_request'].includes(type)) throw new AppError(StatusCodes.BAD_REQUEST, 'type must be bug or feature_request');
  if (status && !['open', 'in_progress', 'resolved'].includes(status as string)) throw new AppError(StatusCodes.BAD_REQUEST, 'status must be open, in_progress or resolved');

  try {
    // Issue cheak
    const existing = await getRawIssue(id)
    if (!existing) throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');

    // Permission cheak just nijer issue update jodi status open thake
    if (user?.role === USER_ROLE.contributor) {
        if (existing.reporter_id !== user?.id) throw new AppError(StatusCodes.FORBIDDEN, 'Just your issue update');
        if (existing.status !== 'open') throw new AppError(StatusCodes.CONFLICT, 'Just open status- issue update permision');
        // Contributor status change korte parbe na
        if (status) throw new AppError(StatusCodes.FORBIDDEN, 'Contributor status do not modify');
        
        // Updated obj make
        const updateFields: Record<string, string> = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (type) updateFields.type = type;

        const updatedContibutor = await updateIssue(id, updateFields);
        return sendSuccess(res, StatusCodes.OK, 'Issue updated successfully', updatedContibutor);
    }

    const updateFields: Record<string, string> = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (type) updateFields.type = type;
    if (status && user?.role === USER_ROLE.maintainer) updateFields.status = status;

    const updated = await updateIssue(id, updateFields);
    return sendSuccess(res, StatusCodes.OK, 'Issue updated successfully', updated);
  } catch (err) {
    return next(err);
  }
};



// 5 DELETE /api/issues/:id
export const deleteIssueHandler = async (req: Request,res: Response, next: NextFunction)=> {
  //Validation cheak
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid issue ID');

  try {
    const issue = await getRawIssue(id);
    if (!issue) throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');

    const deleted = await deleteIssue(id);
    if (deleted.rows.length === 0) return sendSuccess(res, StatusCodes.OK, 'Issue deleted successfully');
  } catch (err) {
    return next(err);
  }
};