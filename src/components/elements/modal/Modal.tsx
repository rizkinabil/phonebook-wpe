import { useEffect } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const modalStyles = css`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
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
        <button onClick={onClose}>x</button>
        {children}
      </div>
    </ModalContainer>
  );
};

export default Modal;
