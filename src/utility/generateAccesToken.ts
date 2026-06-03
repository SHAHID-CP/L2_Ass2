import jwt from 'jsonwebtoken';
import config from '../config';
import type { JwtPayload } from '../middleware/auth';


export const generateAccessToken=(user:JwtPayload)=>{
    // const {id,name,role}=payload
    return jwt.sign(
            { id: user.id,name:user.name,role:user.role},
            config.secret as string,
            { expiresIn: '7d' }
        );
}