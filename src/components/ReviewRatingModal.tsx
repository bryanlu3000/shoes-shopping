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
  HStack,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useState } from "react";

interface ReviewRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  callback: (rating: number) => void;
}

export default function ReviewRatingModal({
  isOpen,
  onClose,
  callback,
}: ReviewRatingModalProps) {
  const [rating, setRating] = useState(0);

  const handleClose = () => {
    setRating(0);
    onClose();
  };

  const handleSubmit = () => {
    callback(rating);
    setRating(0);
    onClose();
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Customer Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>Please rate the product.</Text>
          <HStack
            mt="6"
            justify="center"
            alignItems="center"
            cursor="pointer"
            spacing="4"
          >
            {Array(5)
              .fill("")
              .map((_, i) => (
                <StarIcon
                  key={i}
                  fontSize="4xl"
                  color={i + 1 <= rating ? "teal.500" : "gray.300"}
                  onClick={() => setRating(i + 1)}
                />
              ))}
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
