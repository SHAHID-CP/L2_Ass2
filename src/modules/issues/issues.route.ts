import { Router } from 'express';
import { createIssueHandler, deleteIssueHandler, getAllIssuesHandler, getIssueByIdHandler, updateIssueHandler } from './issues.controller';
import { authenticate, authorize } from '../../middleware/auth';
import { USER_ROLE } from '../../types';



const router = Router();

router.post('/', authenticate, authorize(USER_ROLE.maintainer,USER_ROLE.contributor), createIssueHandler);
router.get('/', getAllIssuesHandler);
router.get('/:id', getIssueByIdHandler);
router.patch('/:id', authenticate, authorize(USER_ROLE.maintainer,USER_ROLE.contributor), updateIssueHandler);
router.delete('/:id', authenticate, authorize(USER_ROLE.maintainer), deleteIssueHandler);

export const issueRoutes=router;