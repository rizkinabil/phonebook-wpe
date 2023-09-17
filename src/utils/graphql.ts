import { makeVar } from '@apollo/client';

export const contactDataVar = makeVar([]);

export const updateContactData = (newData: any) => {
  contactDataVar(newData);
};
