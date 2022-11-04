import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useAppDispatch } from "../redux/reduxTypedHooks";
import { clearCartItems } from "../redux/ShopSlice";

interface SignoutAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignoutAlert({ isOpen, onClose }: SignoutAlertProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { signOut } = useAuthContext();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSignout = () => {
    signOut();
    dispatch(clearCartItems());
    onClose();
    navigate("/");
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Signout Confirmation
          </AlertDialogHeader>

          <AlertDialogBody>
            After sign out, items in the shopping cart will be cleared. Are you
            sure to sign out?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onSignout} ml={3}>
              Sign out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
