import { UserProfile, UserRole } from '../types/auth';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  profile: UserProfile;
}

// Event për ndryshimet e përdoruesit
const dispatchUserChange = () => {
  window.dispatchEvent(new Event('userChange'));
};

// Funksion për të gjeneruar ID unike
const generateId = () => Math.random().toString(36).substr(2, 9);

// Funksionet ndihmëse për localStorage
const getUsers = (): StoredUser[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem('users', JSON.stringify(users));
  
  // Përditëso currentUser nëse është i loguar
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = users.find(u => u.id === currentUser.id);
    if (updatedUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser.profile));
      dispatchUserChange();
    }
  }
};

const getCurrentUser = (): UserProfile | null => {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return null;

  try {
    const profile = JSON.parse(currentUser);
    // Verifiko që përdoruesi ende ekziston në listën e përdoruesve
    const users = getUsers();
    const userExists = users.some(u => u.id === profile.id);
    if (!userExists) {
      localStorage.removeItem('currentUser');
      dispatchUserChange();
      return null;
    }
    return profile;
  } catch (error) {
    localStorage.removeItem('currentUser');
    dispatchUserChange();
    return null;
  }
};

// Funksionet e autentikimit
export const signIn = async (email: string, password: string): Promise<UserProfile> => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Email ose fjalëkalimi është i gabuar');
  }

  localStorage.setItem('currentUser', JSON.stringify(user.profile));
  dispatchUserChange();
  return user.profile;
};

export const signUp = async (
  email: string, 
  password: string, 
  role: UserRole, 
  fullName: string
): Promise<UserProfile> => {
  const users = getUsers();
  
  // Kontrollo nëse emaili ekziston
  if (users.some(u => u.email === email)) {
    throw new Error('Ky email është regjistruar tashmë');
  }

  // Krijo përdoruesin e ri
  const userId = generateId();
  const now = new Date().toISOString();
  
  const newUser: StoredUser = {
    id: userId,
    email,
    password,
    profile: {
      id: userId,
      user_id: userId,
      email,
      full_name: fullName,
      role,
      created_at: now,
      updated_at: now
    }
  };

  // Ruaj përdoruesin
  users.push(newUser);
  saveUsers(users);
  
  // Vendos përdoruesin si të loguar
  localStorage.setItem('currentUser', JSON.stringify(newUser.profile));
  dispatchUserChange();
  return newUser.profile;
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem('currentUser');
  dispatchUserChange();
};

export const getSession = async (): Promise<UserProfile | null> => {
  return getCurrentUser();
};

// Funksionet për menaxhimin e përdoruesve
export const getAllUsers = async (): Promise<UserProfile[]> => {
  return getUsers().map(u => u.profile);
};

export const updateUser = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Përdoruesi nuk u gjet');
  }

  // Përditëso profilin
  users[userIndex].profile = {
    ...users[userIndex].profile,
    ...updates,
    updated_at: new Date().toISOString()
  };

  saveUsers(users);
  
  // Përditëso currentUser nëse është i njëjti përdorues
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem('currentUser', JSON.stringify(users[userIndex].profile));
    dispatchUserChange();
  }
  
  return users[userIndex].profile;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const users = getUsers();
  const newUsers = users.filter(u => u.id !== userId);
  saveUsers(newUsers);
  
  // Çlogo përdoruesin nëse është fshirë
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    localStorage.removeItem('currentUser');
    dispatchUserChange();
  }
}; 