import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

export interface DialogProps {
  content: React.ReactNode;
  title: string;
  onClose: () => void;
  size?: string;
}
const Dialog = ({ content, title, onClose, size }: DialogProps) => {
  console.log(size)
  return (
    <Modal isOpen={true} onClose={onClose} size={size || 'md'}>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{content}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const DialogContext = React.createContext<any>(null);

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = React.useState<any>(null);

  const onClose = useCallback(() => {
    setDialog(null);
  }, [setDialog]);

  return (
    <DialogContext.Provider value={{ dialog, setDialog }}>
      {children}
      {dialog && (
        <Dialog
          content={dialog.content}
          title={dialog.title}
          onClose={dialog.onClose}
          size={dialog.size}
        />
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (context === null) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

export default Dialog;
