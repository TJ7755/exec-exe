// Username storage utility for Exec.exe
// Persists username to localStorage

const STORAGE_KEY = 'exec_exe_username';

export const getUsername = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch (e) {
    return null;
  }
};

export const setUsername = (name) => {
  try {
    localStorage.setItem(STORAGE_KEY, name);
    return true;
  } catch (e) {
    return false;
  }
};

export const hasUsername = () => {
  return !!getUsername();
};

export const clearUsername = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
};
