import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from './auth.service';
import { AppError, sendError, sendSuccess } from '../../utility/sendResponse';
import { generateAccessToken } from '../../utility/generateAccesToken';
import { allowedRoles } from '../../types';
import type { ILoginResponse, IUserResponse } from './auth.interface';



//signup
export const signup = async (req: Request, res: Response, next: NextFunction)=> {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) throw new AppError(StatusCodes.BAD_REQUEST, 'name, email, password required');
  if (role && !allowedRoles.includes(role)) throw new AppError(StatusCodes.BAD_REQUEST, 'role must be contributor or maintainer');
  if (password.length < 8) throw new AppError(StatusCodes.BAD_REQUEST, 'Password must be at least 8 charecters');
  
  try {
    // Duplicate email account cheak
    const existing = await findUserByEmail(email);
    if (existing) throw new AppError(StatusCodes.BAD_REQUEST, 'This email already registered');

    const user = await createUser({ name, email, password, role });
    return sendSuccess<IUserResponse>(res, StatusCodes.CREATED, 'User registered successfully', user);
  } catch (err) {
    return next(err);
  }
};




//login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError(StatusCodes.BAD_REQUEST, 'email and password required');

  try {
    const user = await findUserByEmail(email);
    if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');

    // Password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');

    // JWT make
    const token = generateAccessToken({id: user.id,name:user.name,role:user.role})

    return sendSuccess<ILoginResponse>(res, StatusCodes.OK, 'Login successful', {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    return next(err);
  }
};