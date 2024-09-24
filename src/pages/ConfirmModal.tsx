import React, { useEffect, useState } from 'react';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';

import '../styles/ConfirmModal.css'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  heigth: 300,
  bgcolor: '#fff',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

type ConfirmProps = {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmProps> = ({
  show,
  message,
  onConfirm,
  onCancel
}) => {

  const [isOpen, setIsOpen] = useState(show);

  const handleCloseModal = () => {
    setIsOpen(false);
  }

  const handleOnConfirm = () => {
    setIsOpen(false);
    onConfirm();
  }

  const handleOnCancel = () => {
    setIsOpen(false);
    onCancel();
  }

  return (
    <>
        <Modal
          open={isOpen}
          onClose={handleCloseModal}
          closeAfterTransition
        >
          <Box className="modal-confirm">
            <h4>{ message }</h4>
            <div className="buttons-position">
              <Button className='modal-confirm-buttons' style={{ marginRight: 2, background: '#22184c' }} variant='contained' onClick={handleOnConfirm}>Confirmar</Button>
              <Button className='modal-confirm-buttons' style={{ background: '#22184c' }} variant='contained' onClick={handleOnCancel}>Cancelar</Button>
            </div>
          </Box>
        </Modal>
    </>
  )
}
