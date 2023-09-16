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
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/localStorage';

type Props = {
  onClose: () => void;
};

const AddContact = ({ onClose }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumberInput, setphoneNumberInput] = useState(['']);
  const [expandInputNumber, setExpandInputNumber] = useState(false);
  const { addNotification } = useContext(ToastNotificationsContext);

  const [addContact] = useMutation(ADD_CONTACT_WITH_PHONE);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      // get data from query
      const { data } = await addContact({
        variables: {
          first_name: firstName,
          last_name: lastName,
          phones: phoneNumberInput.map((number) => {
            return { number };
          }),
        },
      });
      // check eksisting, pass to localstorage
      if (data && data.addContact) {
        const updatedData = {
          contact: [...(loadFromLocalStorage('normalContacts') || []), data.addContact],
        };
        saveToLocalStorage('normalContacts', updatedData.contact);
      }

      addNotification('Success add contact', {
        color: 'success',
        autoHide: 3500,
      });

      setFirstName('');
      setLastName('');
      setphoneNumberInput(['']);
    } catch (error) {
      if (error) {
        addNotification(`${error}`, {
          color: 'error',
          autoHide: 3500,
        });
      }
    }
  };

  const handlePhoneNumberChange = (index: any, value: any) => {
    const updatedPhoneNumber = [...phoneNumberInput];
    updatedPhoneNumber[index] = value;

    setphoneNumberInput(updatedPhoneNumber);
  };

  const handleAddPhoneNumber = () => {
    setphoneNumberInput([...phoneNumberInput, '']);
  };

  const handleTogglePhoneInput = () => {
    setExpandInputNumber(!expandInputNumber);
    onClose;
  };

  return (
    <Modal onClose={onClose}>
      <div css={formContactStyle.parent}>
        <div css={formContactStyle.user.header}>
          <UserCircleIcon css={{ width: '7.25rem', height: '7.25rem' }} />
        </div>
        <form onSubmit={handleFormSubmit} css={formContactStyle.user.form}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            css={{ marginBottom: '0.5rem' }}
          />

          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
          <div>
            {phoneNumberInput.map((item, index) => {
              return (
                <div key={index}>
                  <label htmlFor={`phoneNumber${index}`}>Phone Number {index + 1}</label>
                  <input
                    type="text"
                    id={`phoneNumber${index}`}
                    value={item}
                    onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                  />
                </div>
              );
            })}
            {expandInputNumber ? (
              <button type="button" onClick={handleTogglePhoneInput}>
                Collapse Phone Input
              </button>
            ) : (
              <button type="button" onClick={handleAddPhoneNumber}>
                Add Phone Number
              </button>
            )}
          </div>
          <div>
            {!expandInputNumber && (
              <button type="button" onClick={handleTogglePhoneInput}>
                Expand Phone Input
              </button>
            )}
          </div>
          <button type="submit">add contact</button>
        </form>
      </div>
    </Modal>
  );
};

export default AddContact;
