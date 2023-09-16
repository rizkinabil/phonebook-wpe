export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = (key: string): any => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};
