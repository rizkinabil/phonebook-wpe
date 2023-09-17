import { useEffect } from 'react';
import { css } from '@emotion/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import styled from '@emotion/styled';

const modalStyles = css`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 2px 1px 8px rgba(0, 0, 0, 0.1);
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

const Modal = ({ children, onClose, title }: ModalProps) => {
  useEffect(() => {
    // Add event listeners for "Escape" key press and clicks outside the modal
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.getElementById('modal-container');
      if (modalElement && !modalElement.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  return (
    <ModalContainer>
      <div css={modalStyles}>
        <div css={{ display: 'flex', alignItems: 'center' }}>
          <XCircleIcon onClick={onClose} width={'1.5rem'} height={'1.5rem'} />
          <h3 css={{ left: '20%' }}>{title}</h3>
        </div>
        {children}
      </div>
    </ModalContainer>
  );
};

export default Modal;
