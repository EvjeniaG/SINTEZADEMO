import { UserProfile } from '../types/auth';

/**
 * Retrieves all users from localStorage
 * @returns Array of UserProfile objects
 */
export const getStoredUsers = (): UserProfile[] => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error parsing users from localStorage:', error);
    return [];
  }
};

/**
 * Checks if a specific user exists by email
 * @param email Email to search for
 * @returns UserProfile if found, null otherwise
 */
export const findUserByEmail = (email: string): UserProfile | null => {
  const users = getStoredUsers();
  return users.find(user => user.email === email) || null;
};

/**
 * Checks if admin user exists
 * @returns boolean indicating if admin exists
 */
export const checkAdminExists = (): boolean => {
  const adminUser = findUserByEmail('admin@shptk.com');
  console.log(adminUser ? 'Përdoruesi ende ekziston' : 'Përdoruesi është fshirë');
  return !!adminUser;
}; 