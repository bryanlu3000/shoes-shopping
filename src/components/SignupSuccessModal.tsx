import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface SignupSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupSuccessModal({
  isOpen,
  onClose,
}: SignupSuccessModalProps) {
  const navigate = useNavigate();

  const onSignin = () => {
    onClose();
    navigate(-1);
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign up success</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>You have successfully signed up. Please sign in now.</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onSignin}>
            Sign in
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
