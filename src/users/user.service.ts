// src/users/user.service.ts
import bcrypt from 'bcryptjs';
import { db } from '../_helpers/db';
import { Role } from '../_helpers/role';
import { User, UserCreationAttributes } from './user.model';

export const userService = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll(): Promise<User[]> {
  return await db.User.findAll();
}

async function getById(id: number): Promise<User> {
  return await getUser(id);
}

async function create(params: UserCreationAttributes & { password: string }): Promise<void> {
  
  const existingUser = await db.User.findOne({ where: { email: params.email } });
  if (existingUser) {
    throw new Error(`Email "${params.email}" is already registered`);
  }

  
  const passwordHash = await bcrypt.hash(params.password, 10);


  await db.User.create({
    ...params,
    passwordHash,
    role: params.role || Role.User, 
  } as UserCreationAttributes);
}

async function authenticate(email: string, password: string): Promise<Omit<User, 'passwordHash'>> {
  const user = await db.User.scope('withHash').findOne({ where: { email } });
  if (!user) throw new Error('Email not found');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Wrong password');

  // Return user without passwordHash
  const { passwordHash, ...userWithoutHash } = user.toJSON() as any;
  return userWithoutHash;
}

async function update(id: number, params: Partial<UserCreationAttributes> & { password?: string }): Promise<void> {
  const user = await getUser(id);

 
  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
    delete params.password; // Remove plain password
  }

  
  await user.update(params as Partial<UserCreationAttributes>);
}

async function _delete(id: number): Promise<void> {
  const user = await getUser(id);
  await user.destroy();
}

// Helper: Get user or throw error
async function getUser(id: number): Promise<User> {
  const user = await db.User.scope('withHash').findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}