export type UserRole = 'admin' | 'mesues' | 'nxenes';

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  // Për mësuesit
  class_id?: string;
  subject?: string;
  // Për nxënësit
  grade?: number;
  progress?: {
    quizzes_completed: number;
    simulations_completed: number;
    total_points: number;
  };
}

export interface AccessControl {
  allowedRoles: UserRole[];
  publicAccess?: boolean;
}

// Përcaktojmë aksesin për çdo rrugë
export const ROUTE_ACCESS: Record<string, AccessControl> = {
  '/': { allowedRoles: ['admin', 'mesues', 'nxenes'], publicAccess: true },
  '/dashboard': { allowedRoles: ['admin', 'mesues', 'nxenes'], publicAccess: true },
  '/dashboard/alarme': { allowedRoles: ['admin'] },
  '/dashboard/raporte': { allowedRoles: ['admin'] },
  '/dashboard/eksport': { allowedRoles: ['admin'] },
  '/edukimi': { allowedRoles: ['admin', 'mesues', 'nxenes'], publicAccess: true },
  '/edukimi/kuize': { allowedRoles: ['admin', 'mesues', 'nxenes'] },
  '/edukimi/simulime': { allowedRoles: ['admin', 'mesues', 'nxenes'] },
  '/edukimi/ai-tutor': { allowedRoles: ['admin', 'mesues', 'nxenes'] },
  '/edukimi/keshilla': { allowedRoles: ['admin', 'mesues', 'nxenes'] },
  '/mirembajte': { allowedRoles: ['admin', 'mesues'] },
  '/perdoruesit': { allowedRoles: ['admin'] },
  '/profile': { allowedRoles: ['admin', 'mesues', 'nxenes'], publicAccess: true },
  '/settings': { allowedRoles: ['admin', 'mesues', 'nxenes'], publicAccess: true }
}; 