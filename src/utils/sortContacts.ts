export interface IContact {
  id: string;
  first_name: string;
  last_name: string;
  phones: { number: string }[];
}

export const sortContacts = (contacts: IContact[], favorite: string[], startIndex: number, endIndex: number): any => {
  const favContact: IContact[] = [];
  const normalContact: IContact[] = [];
  contacts.forEach((contact) => {
    if (favorite.includes(contact.id)) {
      favContact.push(contact);
    } else {
      normalContact.push(contact);
    }
  });

  return [...favContact, ...normalContact.slice(startIndex, endIndex)];
};
