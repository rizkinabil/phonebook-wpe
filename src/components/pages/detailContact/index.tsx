import { Container, H5, ToastNotificationsContext } from 'cherry-components';
import { theme } from '../../../assets/style/theme';
import Button from '../../elements/button/Button';
import { detailContactStyle } from './index.style';
import { UserCircleIcon, ArrowSmallLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useNavigate, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

// graphql lib
import { useMutation, useQuery } from '@apollo/client';
import { GET_CONTACT_DETAIL } from '../../../graphql/query';
import { useContext, useState } from 'react';
import { DELETE_BY_PK, UPDATE_CONTACT_BY_ID, UPDATE_PHONE } from '../../../graphql/mutation';

interface ContactData {
  first_name: string;
  last_name: string;
  phones: { id: string; number: string }[];
}

const DetailContact = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { addNotification } = useContext(ToastNotificationsContext);

  const [editFirstName, setEditFirstName] = useState<boolean>(false);
  const [editLastName, setEditLastName] = useState<boolean>(false);
  // const [editPhoneNumber, setEditPhoneNumber] = useState<{ [key: string]: boolean }>({});
  const [editPhoneNumber, setEditPhoneNumber] = useState<boolean>(false);
  const [editActive, setEditActive] = useState<boolean>(false);

  const [updatedData, setUpdatedData] = useState<ContactData>({
    first_name: '',
    last_name: '',
    phones: [{ id: '', number: '' }],
  });

  const [updateContactMutation] = useMutation(UPDATE_CONTACT_BY_ID);
  const [updatePhoneNumMutation] = useMutation(UPDATE_PHONE);
  const { data, loading } = useQuery(GET_CONTACT_DETAIL, {
    variables: {
      id: params.id,
    },
  });

  const handleEdit = () => {
    setEditActive(!editActive);
    setEditFirstName(!editFirstName);
    setEditLastName(!editLastName);
  };

  const handleEditPhone = () => {
    const phoneNumbersEditMode: { [key: string]: boolean } = {};
    for (const phoneNumber of updatedData.phones) {
      phoneNumbersEditMode[phoneNumber.id] = false;
    }
    setEditPhoneNumber(!editPhoneNumber);
  };

  const handleInputChange = (field: string, value: string | any | undefined) => {
    if (field === 'phones') {
      const phonesArray = Array.isArray(value) ? value.map((number: string) => ({ number })) : [];

      setUpdatedData((prevdata) => ({
        ...prevdata,
        [field]: phonesArray as any,
      }));
    } else {
      const trimValue = value.trim();
      if (trimValue === '') {
        setUpdatedData((prevDataContact) => ({
          ...prevDataContact,
          [field]: (updatedData as any)[field],
        }));
      } else {
        // Otherwise, update the field with the sanitized value
        setUpdatedData((prevDataContact) => ({
          ...prevDataContact,
          [field]: trimValue,
        }));
      }
    }
  };

  const saveChanges = async () => {
    try {
      const { data } = await updateContactMutation({
        variables: {
          id: params.id,
          _set: { first_name: updatedData.first_name, last_name: updatedData.last_name },
        },
      });

      // validate
      if (data && data.update_contact_by_pk) {
        addNotification('Changes Saved', {
          color: 'success',
          autoHide: 3500,
        });
      }
      setEditActive(!editActive);

      // navigate('/');
    } catch (error) {
      console.log(error);

      if (error) {
        addNotification(`${error}`, {
          color: 'error',
          autoHide: 3500,
        });
      }
    }
  };

  const handleEditPhoneNumber = async (phoneNumberId: string, newPhoneNumber: string) => {
    try {
      const { data } = await updatePhoneNumMutation({
        variables: {
          pk_columns: { id: phoneNumberId },
          new_phone_number: newPhoneNumber,
        },
      });

      // validate
      if (data && data.update_phone_by_pk) {
        addNotification('Phone Number Updated', {
          color: 'success',
          autoHide: 3500,
        });
      }
    } catch (error) {
      console.log(error);

      if (error) {
        addNotification(`${error}`, {
          color: 'error',
          autoHide: 3500,
        });
      }
    }
  };

  const [deleteContact] = useMutation(DELETE_BY_PK, {
    onCompleted: (data) => {
      if (data.delete_contact_by_pk) {
        addNotification('Contact Deleted', {
          color: 'error',
          autoHide: 3500,
        });

        navigate('/');
      }
    },
  });

  const userData = data ? data.contact_by_pk : [];

  return (
    <Container css={{ position: 'relative', height: '93vh' }}>
      <div css={detailContactStyle.top}>
        <ArrowSmallLeftIcon
          css={{ width: '1.5rem', height: '1.5rem' }}
          onClick={() => {
            navigate(-1);
          }}
        />
        {editActive ? (
          <Button
            width="4.6875rem"
            height="2rem"
            border="none"
            color={theme.colors.primary}
            radius="25px"
            onClick={saveChanges}
          >
            <H5 css={{ color: 'white' }}>Save</H5>
          </Button>
        ) : (
          <Button
            width="4.6875rem"
            height="2rem"
            border="none"
            color={theme.colors.warning}
            radius="25px"
            onClick={handleEdit}
          >
            <H5>Edit</H5>
          </Button>
        )}
      </div>
      <div css={detailContactStyle.user.header}>
        {loading ? (
          <Skeleton count={2} />
        ) : (
          <div>
            <UserCircleIcon css={{ width: '7.25rem', height: '7.25rem' }} />
            <h1>
              {editActive && editFirstName ? (
                <input
                  type="text"
                  placeholder={userData.first_name}
                  required
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                />
              ) : (
                userData.first_name
              )}{' '}
              {editActive && editLastName ? (
                <input
                  type="text"
                  placeholder={userData.last_name}
                  required
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                />
              ) : (
                userData.last_name
              )}
            </h1>
          </div>
        )}
      </div>

      <div>
        {loading ? (
          <Skeleton count={2} />
        ) : (
          <div>
            {userData.phones.map((item: any, index: number) => {
              return (
                <div key={index} css={{ display: 'flex', flexDirection: 'column' }}>
                  <div css={{ display: 'flex', gap: '1rem' }}>
                    <label htmlFor={`phoneNumber${index}`}>Phone Number {index + 1}</label>
                    <button onClick={handleEditPhone} disabled>
                      Edit (soon)
                    </button>
                  </div>
                  {editPhoneNumber ? (
                    <>
                      <input
                        type="text"
                        id={`phoneNumber${index}`}
                        placeholder={item.number}
                        onChange={(e) => {
                          const newPhonesNumber = e.target.value;
                          handleInputChange('phones', newPhonesNumber);
                        }}
                      />
                      <Button
                        width="4.6875rem"
                        height="2rem"
                        border="none"
                        color={theme.colors.warning}
                        radius="25px"
                        onClick={() => handleEditPhoneNumber(item.id, updatedData.phones[index].number || '')}
                      >
                        <span>save</span>
                      </Button>
                    </>
                  ) : (
                    <h3>+{item.number}</h3>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div css={detailContactStyle.bottom.wrapper}>
        <Button
          border="none"
          width="100%"
          height="3rem"
          color={theme.colors.error}
          radius="15px"
          onClick={() => deleteContact({ variables: { id: params.id } })}
        >
          <div css={detailContactStyle.bottom.child}>
            <h2>Delete</h2>
            <TrashIcon css={{ height: '2rem', width: '2rem' }} />
          </div>
        </Button>
      </div>
    </Container>
  );
};

export default DetailContact;
