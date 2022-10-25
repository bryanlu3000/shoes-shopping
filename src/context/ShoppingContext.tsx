import { useDisclosure } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useState } from "react";

interface ShoppingContext {
  isHomepage: boolean; // Toggle to switch sticky navbar between homepage and other pages
  setIsHomepage: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ShoppingContext = createContext({} as ShoppingContext);
export const useShopping = () => useContext(ShoppingContext);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const [isHomepage, setIsHomepage] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ShoppingContext.Provider
      value={{ isHomepage, setIsHomepage, isOpen, onOpen, onClose }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};
