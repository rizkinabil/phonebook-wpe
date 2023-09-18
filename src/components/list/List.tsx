import { theme } from '../../assets/style/theme';
import Button from '../elements/button/Button';
import { Link } from 'react-router-dom';
import { listStyle } from './List.style';
import {
  UserCircleIcon,
  TrashIcon,
  StarIcon as SolidStarIcon,
  ForwardIcon,
  BackwardIcon,
} from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { DELETE_BY_PK } from '../../graphql/mutation';
import { useContext } from 'react';
import { ToastNotificationsContext } from 'cherry-components';
import Modal from '../elements/modal/Modal';
import { IContact, sortContacts } from '../../utils/sortContacts';
import { GET_CONTACT_QUERY, SEARCH_BY_NAME } from '../../graphql/query';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

const List = () => {
  let displayData: IContact[];
  const { addNotification } = useContext(ToastNotificationsContext);

  const [favorite, setFavorite] = useState(loadFromLocalStorage('favorites') || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchVal, setsearchVal] = useState<string>('');
  const [modalActive, setModalActive] = useState(false);
  useEffect(() => {
    const storedFav = loadFromLocalStorage('favorites');
    if (storedFav) {
      setFavorite(storedFav);
    }
  }, []);

  const { data } = useQuery(GET_CONTACT_QUERY, {
    variables: {
      order_by: {
        first_name: 'asc',
      },
    },
    pollInterval: 2000,
  });

  // custom pagination
  const normalItemPerPage = 10;
  const totalNormalItem = data ? data.contact.length - favorite.length : 0;
  const totalPage = Math.ceil(totalNormalItem / normalItemPerPage);

  const startIndex = (currentPage - 1) * normalItemPerPage;
  const endIndex = startIndex + normalItemPerPage;

  const navToPage = (page: number) => {
    if (page >= 1 && page <= totalPage) {
      setCurrentPage(page);
    }
  };

  displayData = data ? sortContacts(data.contact, favorite, startIndex, endIndex) : [];

  const [searchContacts, { data: searchResults }] = useLazyQuery(SEARCH_BY_NAME);
  const [deleteContact, { loading }] = useMutation(DELETE_BY_PK, {
    onCompleted: (data) => {
      if (data && data.delete_contact_by_pk) {
        const updatedData = displayData.filter((contact: any) => contact.id !== data.delete_contact_by_pk.id);
        displayData = updatedData;

        addNotification('Contact Deleted', {
          color: 'error',
          autoHide: 3500,
        });
      }
      setModalActive(false);
    },
  });

  const toggleFav = (contactId: string): void => {
    const updatedFav: string[] = favorite.includes(contactId)
      ? favorite.filter((id: string) => id !== contactId)
      : [...favorite, contactId];

    setFavorite(updatedFav);
    saveToLocalStorage('favorites', updatedFav);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setsearchVal(value);
    event.preventDefault();

    if (value.trim() === '') {
      searchContacts({ variables: { order_by: { first_name: 'asc' }, where: {} } });
    } else {
      searchContacts({
        variables: {
          order_by: {
            first_name: 'asc',
          },
          where: {
            _or: [{ first_name: { _like: `%${searchVal}%` } }, { last_name: { _like: `%${searchVal}%` } }],
          },
        },
      });
    }
  };

  if (searchResults && searchResults.contact) {
    displayData = searchResults.contact ? sortContacts(searchResults.contact, favorite, startIndex, endIndex) : [];
  } else {
    displayData = data ? sortContacts(data.contact, favorite, startIndex, endIndex) : [];
  }

  return (
    <>
      <div css={listStyle.topSection}>
        <h3>List Contact</h3>
        <div css={{ float: 'right', position: 'absolute', right: '0' }}>
          <input type="text" value={searchVal} onChange={handleSearchInputChange} placeholder="find people" />
        </div>
      </div>
      <div css={listStyle.wrapper}>
        {displayData.map((item: any, index: number) => {
          return (
            <div
              css={{
                position: 'relative',
                marginBottom: '0.75rem',
              }}
              key={index}
            >
              <Link to={`/contact/${item.id}`} css={listStyle.elementList}>
                <Button
                  height="60px"
                  width="full-width"
                  color={`${theme.colors.grayLight}`}
                  border="solid"
                  radius="10px"
                >
                  <div css={{ display: 'flex', alignItems: 'center' }}>
                    <UserCircleIcon css={{ width: '3rem', height: '3rem' }} />
                    <div css={listStyle.content}>
                      <span css={{ fontSize: '1rem', fontWeight: 'bold', maxWidth: '200px' }}>
                        {item.first_name + ' ' + item.last_name}
                      </span>
                      <span
                        css={{
                          fontSize: '12px',
                          color: 'black',
                        }}
                      >
                        <span css={{ fontWeight: 'bold', color: 'grey' }}>Primary:</span>{' '}
                        <span css={{ color: 'grey' }}> +{item.phones[0].number}</span>
                      </span>
                    </div>
                  </div>
                </Button>
              </Link>
              <div css={{ position: 'absolute', display: 'flex', right: '0', top: '25%' }}>
                <button
                  onClick={() => toggleFav(item.id)}
                  css={{ marginRight: '1rem', border: 'none', backgroundColor: 'transparent' }}
                >
                  {favorite.includes(item.id) ? (
                    <SolidStarIcon color={theme.colors.warning} width={'1.5rem'} height={'1.5rem'} />
                  ) : (
                    <OutlineStarIcon color={theme.colors.grayDark} width={'1.5rem'} height={'1.5rem'} />
                  )}
                </button>

                {modalActive ? (
                  <Modal
                    onClose={() => {
                      setModalActive(false);
                    }}
                  >
                    <div>
                      <h2>Delete this contact?</h2>
                      <div css={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                          css={{
                            backgroundColor: `${theme.colors.grayDark}`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            height: '30px',
                            fontWeight: 'bold',
                          }}
                          onClick={() => {
                            setModalActive(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          css={{
                            backgroundColor: `${theme.colors.error}`,
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            height: '30px',
                            fontWeight: 'bold',
                          }}
                          onClick={() => {
                            deleteContact({ variables: { id: item.id } });
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Modal>
                ) : (
                  <button
                    onClick={() => {
                      setModalActive(true);
                    }}
                    css={{ marginRight: '1rem', backgroundColor: 'transparent', border: 'none' }}
                    disabled={loading}
                  >
                    <TrashIcon color={theme.colors.error} width={'1.5rem'} height={'1.5rem'} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div css={listStyle.pagination}>
        <span>
          Showing <span>{currentPage}</span> to <span>{totalPage}</span> of <span>Entries</span>
        </span>
        <div>
          <button onClick={() => navToPage(currentPage - 1)} disabled={currentPage === 1} css={{ marginRight: '1rem' }}>
            <BackwardIcon width={'1rem'} height={'1rem'} />
          </button>
          <button onClick={() => navToPage(currentPage + 1)} disabled={currentPage === totalPage}>
            <ForwardIcon width={'1rem'} height={'1rem'} />
          </button>
        </div>
      </div>
    </>
  );
};

export default List;
