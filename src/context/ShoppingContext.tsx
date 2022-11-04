import { useDisclosure } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useState } from "react";
import useAxios from "../hooks/useAxios";

interface AddItemRatingProps {
  id: string;
  rating: number;
  callback: () => void;
}

interface ShoppingContextProps {
  isHomepage: boolean; // Toggle to switch sticky navbar between homepage and other pages
  setIsHomepage: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  openShoppingCart: () => void;
  onClose: () => void;
  addItemRating: (props: AddItemRatingProps) => void;
}

const ShoppingContext = createContext({} as ShoppingContextProps);
export const useShopping = () => useContext(ShoppingContext);

export const ShoppingContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isHomepage, setIsHomepage] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Control ShopingCart open/close
  const openShoppingCart = () => onOpen(); // Try not to conflict with other onOpen function
  const axiosWithAccessToken = useAxios();

  const addItemRating = ({ id, rating, callback }: AddItemRatingProps) => {
    axiosWithAccessToken
      .put(`/api/items/rating/${id}`, { rating })
      .then((res) => {
        if (res.status === 200) {
          callback();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ShoppingContext.Provider
      value={{
        isHomepage,
        setIsHomepage,
        isOpen,
        openShoppingCart,
        onClose,
        addItemRating,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};
