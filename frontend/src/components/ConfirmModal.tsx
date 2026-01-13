import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { AlertTriangle, Trash2, Info, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <Trash2 size={48} className="text-danger" />;
      case 'warning':
        return <AlertTriangle size={48} className="text-warning" />;
      case 'info':
        return <Info size={48} className="text-primary" />;
      default:
        return <AlertCircle size={48} className="text-default-500" />;
    }
  };

  const getConfirmColor = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      classNames={{
        backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                {getIcon()}
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-default-600">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onCloseModal}
                isDisabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                color={getConfirmColor()}
                onPress={() => {
                  onConfirm();
                  onCloseModal();
                }}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// Hook for easier usage
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<ConfirmModalProps, 'isOpen' | 'onClose'>>({
    onConfirm: () => {},
    title: '',
    message: '',
  });

  const openConfirm = (newConfig: Omit<ConfirmModalProps, 'isOpen' | 'onClose'>) => {
    setConfig(newConfig);
    setIsOpen(true);
  };

  const closeConfirm = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openConfirm,
    closeConfirm,
    config,
  };
};
