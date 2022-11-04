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
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SigninModal() {
  const { isOpen, onClose } = useAuthContext();
  const navigate = useNavigate();

  const onSignin = () => {
    onClose();
    navigate("/signin");
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
        <ModalHeader>Sign in required</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>In order to proceed, please sign in first.</Text>
          <Text>
            (You can sign in with guest@gmail.com, password: Hello123) Or sign
            up a new user to log in.
          </Text>
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
