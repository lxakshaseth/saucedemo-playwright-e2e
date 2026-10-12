import type { SauceDemoUser } from '@/types/index.ts';

const PASSWORD = process.env.PASSWORD;

if (!PASSWORD) {
  throw new Error('Environment variable PASSWORD is not set.');
}

const allUsers: SauceDemoUser[] = [
  { username: 'standard_user', password: PASSWORD, description: 'standard', status: 'active' },
  { username: 'locked_out_user', password: PASSWORD, description: 'locked', status: 'inactive' },
  { username: 'problem_user', password: PASSWORD, description: 'problem', status: 'active' },
  { username: 'performance_glitch_user', password: PASSWORD, description: 'glitch', status: 'active' },
  { username: 'error_user', password: PASSWORD, description: 'error', status: 'active' },
  { username: 'visual_user', password: PASSWORD, description: 'visual', status: 'active' },
  { username: 'non_existing_user', password: 'password', description: 'non_existing', status: 'inactive' },
];

function getUserByUsername(username: string): SauceDemoUser {
  const user = allUsers.find((u) => u.username === username);
  if (!user) {
    throw new Error(`User '${username}' not found.`);
  }
  return user;
}

export function loadUsers() {
  const activeUsers = allUsers.filter(
    (u) => u.status === 'active' && u.username !== 'performance_glitch_user'
  );
  const standardUser = getUserByUsername('standard_user');
  const lockedUser = getUserByUsername('locked_out_user');
  const nonExistingUser = getUserByUsername('non_existing_user');

  return {
    activeUsers,
    standardUser,
    lockedUser,
    nonExistingUser,
  };
}
