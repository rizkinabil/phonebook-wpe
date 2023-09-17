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
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { DELETE_BY_PK } from '../../graphql/mutation';
import { useContext } from 'react';
import { removeFromLocalStorageById, saveToLocalStorage } from '../../utils/localStorage';
import { ToastNotificationsContext } from 'cherry-components';
import Modal from '../elements/modal/Modal';
// import { contactDataVar } from '../../utils/graphql';

const SEARCH_BY_NAME = gql`
  query GetContactList($where: contact_bool_exp, $order_by: [contact_order_by!]) {
    contact(where: $where, order_by: $order_by) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

interface IProps {
  listTitle: string;
  datas: any;
  favorite: string[];
  toggleFav: (contactId: string) => void;
  currentPage: number;
  totalPage: number;
  navToPage: (page: number) => void;
}

interface IContact {
  id: string;
  first_name: string;
  last_name: string;
  phones: { number: string }[];
}

const List = (props: IProps) => {
  let displayData: IContact[];
  const { addNotification } = useContext(ToastNotificationsContext);

  // reactive-var
  // const consumedData = useReactiveVar(contactDataVar);

  const title: string = props.listTitle;
  const currPage: number = props.currentPage;
  const totalOfPage: number = props.totalPage;

  const [modalActive, setModalActive] = useState(false);

  const [searchVal, setsearchVal] = useState<string>('');
  const [searchContacts, { data: searchResults }] = useLazyQuery(SEARCH_BY_NAME, {
    fetchPolicy: 'network-only',
  });
  const [deleteContact, { loading }] = useMutation(DELETE_BY_PK, {
    onCompleted: (data) => {
      if (data && data.delete_contact_by_pk) {
        const updatedData = displayData.filter((contact: any) => contact.id !== data.delete_contact_by_pk.id);
        displayData = updatedData;

        const filteredLocalStorageData = removeFromLocalStorageById('normalContacts', data.delete_contact_by_pk.id);
        saveToLocalStorage('normalContacts', filteredLocalStorageData);
        addNotification('Contact Deleted', {
          color: 'error',
          autoHide: 3500,
        });
      }
      setModalActive(false);
    },
  });

  if (searchResults && searchResults.contact) {
    displayData = searchResults.contact;
  } else {
    displayData = props.datas;
  }

  // Sort data to display fav first
  displayData.sort((contactA: any, contactB: any) => {
    const isFavoriteA = props.favorite.includes(contactA.id);
    const isFavoriteB = props.favorite.includes(contactB.id);
    if (isFavoriteA && !isFavoriteB) {
      return -1;
    }
    if (!isFavoriteA && isFavoriteB) {
      return 1;
    }
    return contactA.first_name.localeCompare(contactB.first_name);
  });

  // console.log(displayData);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setsearchVal(value);
    event.preventDefault();

    if (value.trim() === '') {
      searchContacts({ variables: { where: {} } });
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

  // const displayData = searchResults ? searchResults.contact : props.datas;

  return (
    <>
      <div css={listStyle.topSection}>
        <h3>{title}</h3>
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
                  onClick={() => props.toggleFav(item.id)}
                  css={{ marginRight: '1rem', border: 'none', backgroundColor: 'transparent' }}
                >
                  {props.favorite.includes(item.id) ? (
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
                      <div>
                        <button
                          onClick={() => {
                            deleteContact({ variables: { id: item.id } });
                          }}
                        >
                          Delete
                        </button>
                        <button>Cancel</button>
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
          Showing <span>{currPage}</span> to <span>{totalOfPage}</span> of <span>Entries</span>
        </span>
        <div>
          <button onClick={() => props.navToPage(currPage - 1)} disabled={currPage === 1} css={{ marginRight: '1rem' }}>
            <BackwardIcon width={'1rem'} height={'1rem'} />
          </button>
          <button onClick={() => props.navToPage(currPage + 1)} disabled={currPage === totalOfPage}>
            <ForwardIcon width={'1rem'} height={'1rem'} />
          </button>
        </div>
      </div>
    </>
  );
};

export default List;
