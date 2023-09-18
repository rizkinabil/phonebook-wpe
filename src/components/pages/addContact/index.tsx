import { UserCircleIcon } from '@heroicons/react/24/solid';
// import { Container, H5 } from 'cherry-components';
// import { useNavigate } from 'react-router-dom';
// import Button from '../../elements/button/Button';
// import { theme } from '../../../assets/style/theme';
import { formContactStyle } from './index.style';
import { useState, useContext } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_CONTACT_WITH_PHONE } from '../../../graphql/mutation';
import { ToastNotificationsContext } from 'cherry-components';
import Modal from '../../elements/modal/Modal';
import { theme } from '../../../assets/style/theme';

type Props = {
  onClose?: () => void;
};

const AddContact = ({ onClose }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumberInput, setphoneNumberInput] = useState(['']);
  const { addNotification } = useContext(ToastNotificationsContext);

  const [addContact] = useMutation(ADD_CONTACT_WITH_PHONE);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // get data from query
      await addContact({
        variables: {
          first_name: firstName,
          last_name: lastName,
          phones: phoneNumberInput.map((number) => {
            return { number };
          }),
        },
      });

      addNotification('Success add contact', {
        color: 'success',
        autoHide: 3500,
      });

      setFirstName('');
      setLastName('');
      setphoneNumberInput(['']);
      handleClose();
    } catch (error) {
      if (error) {
        addNotification(`${error}`, {
          color: 'error',
          autoHide: 3500,
        });
      }
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const handlePhoneNumberChange = (index: any, value: any) => {
    const updatedPhoneNumber = [...phoneNumberInput];
    updatedPhoneNumber[index] = value;

    setphoneNumberInput(updatedPhoneNumber);
  };

  const handleAddPhoneNumber = () => {
    setphoneNumberInput([...phoneNumberInput, '']);
  };

  return (
    <Modal onClose={handleClose} title="Add Contact">
      <div css={formContactStyle.parent}>
        <div css={formContactStyle.user.header}>
          <UserCircleIcon css={{ width: '4.25rem', height: '4.25rem' }} />
        </div>
        <form onSubmit={handleFormSubmit} css={formContactStyle.user.form}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            css={{ marginBottom: '1rem' }}
          />

          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            css={{ marginBottom: '1.5rem' }}
          />
          <div>
            {phoneNumberInput.map((item, index) => {
              return (
                <div key={index} css={{ display: 'grid' }}>
                  <label htmlFor={`phoneNumber${index}`} css={{ fontSize: '12px', fontWeight: 'bold' }}>
                    Phone Number {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`phoneNumber${index}`}
                    value={item}
                    onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                  />
                </div>
              );
            })}
            <button type="button" onClick={handleAddPhoneNumber} css={{ margin: '1rem 0 3rem' }}>
              +
            </button>
          </div>
          <button
            type="submit"
            css={{
              backgroundColor: `${theme.colors.primary}`,
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              height: '30px',
              fontWeight: 'bold',
            }}
          >
            Save
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddContact;
