export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = (key: string): any => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

export const removeFromLocalStorageById = (key: string, idToRemove: string): void => {
  const currentData = loadFromLocalStorage(key) || [];
  const updatedData = currentData.filter((item: any) => item.id !== idToRemove);

  saveToLocalStorage(key, updatedData);
};
