import List from '../../list/List';
import { useQuery } from '@apollo/client';
import Layout from '../../Layout';
import Button from '../../elements/button/Button';
import { AddIcon } from '../../../assets/icons/AddIcon';
import { theme } from '../../../assets/style/theme';
import { homePageStyle } from './index.style';
import { useEffect, useState } from 'react';
import { GET_CONTACT_QUERY } from '../../../graphql/query';

import AddContact from '../addContact';
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/localStorage';
import Skeleton from 'react-loading-skeleton';
// import { updateContactData } from '../../../utils/graphql';

interface IContact {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phones: { number: string }[];
}

// type Props = {}

const LandingPage = () => {
  const { data, loading, error } = useQuery(GET_CONTACT_QUERY, {
    variables: {
      order_by: {
        first_name: 'asc',
      },
    },
    pollInterval: 5000,
  });

  const [favorite, setFavorite] = useState(loadFromLocalStorage('favorites') || []);
  const [normalContacts, setNormalContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const errMessage = error?.message;
  const normalItemPerPage = 10;

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const totalNormalItem = data ? data.contact.length - favorite.length : 0;
  const totalPage = Math.ceil(totalNormalItem / normalItemPerPage);

  const navToPage = (page: number) => {
    if (page >= 1 && page <= totalPage) {
      setCurrentPage(page);
    }
  };

  // combine fav first and normal
  const sortContacts = (
    contacts: IContact[],
    favorite: string[],
    currentPage: number,
    normalItemPerPage: number
  ): any => {
    const favContact: IContact[] = [];
    const normalContact: IContact[] = [];

    const startIndex = (currentPage - 1) * normalItemPerPage;
    const endIndex = startIndex + normalItemPerPage;

    contacts.forEach((contact) => {
      if (favorite.includes(contact.id)) {
        favContact.push(contact);
      } else {
        normalContact.push(contact);
      }
    });

    return [...favContact, ...normalContact.slice(startIndex, endIndex)];
  };

  const toggleFav = (contactId: string): void => {
    const updatedFav: string[] = favorite.includes(contactId)
      ? favorite.filter((id: string) => id !== contactId)
      : [...favorite, contactId];

    setFavorite(updatedFav);
    saveToLocalStorage('favorites', updatedFav);
  };

  useEffect(() => {
    const storedFav = loadFromLocalStorage('favorites');
    if (storedFav) {
      setFavorite(storedFav);
    }
  }, []);

  useEffect(() => {
    const storedNormalContacts = loadFromLocalStorage('normalContacts');
    if (storedNormalContacts) {
      setNormalContacts(storedNormalContacts);
    }
  }, [favorite, currentPage]);

  useEffect(() => {
    if (data) {
      // Save the normal contacts to local storage
      saveToLocalStorage('normalContacts', data.contact);
    }
  }, [data]);

  const sortedData = normalContacts ? sortContacts(normalContacts, favorite, currentPage, normalItemPerPage) : [];
  // const consumedData = updateContactData(sortedData);

  return (
    <Layout>
      <div css={homePageStyle.hero}>Find your beloved one from this PhoneBook</div>
      <div>
        {loading ? (
          <div>
            <h3>
              <Skeleton />
            </h3>
            <div>
              <Skeleton count={10} height={'60px'} borderRadius={'15px'} />
            </div>
          </div>
        ) : (
          <List
            datas={sortedData}
            listTitle="List Contact"
            favorite={favorite}
            toggleFav={toggleFav}
            currentPage={currentPage}
            totalPage={totalPage}
            navToPage={navToPage}
          />
        )}
        {error && <p>Error: {errMessage}</p>}
      </div>
      <div css={homePageStyle.addButtonBottom}>
        <Button
          children={<AddIcon />}
          color={theme.colors.primaryLight}
          radius="50%"
          width="3.275rem"
          height="3.275rem"
          border="solid 1px blue"
          onClick={handleOpen}
        />
        {open && <AddContact onClose={handleClose} />}
      </div>
    </Layout>
  );
};

export default LandingPage;
