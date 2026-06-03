import {pool} from '../../db';
import bcrypt from "bcryptjs";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'contributor' | 'maintainer';
}



// new user make
export const createUser = async (payload: CreateUserInput) => {
  const { name, email, password, role = 'contributor' } = payload;

  // Password hash 
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role]
  );

  return result.rows[0];
};

// Email exist kore kina
export const findUserByEmail = async (email: string) => {
  
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};