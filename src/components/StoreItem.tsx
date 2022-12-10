import {
  Box,
  Image,
  Text,
  Flex,
  Spacer,
  Button,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../redux/reduxTypedHooks";
import { addCartItem } from "../redux/ShopSlice";
import { useShopping } from "../context/ShoppingContext";
import { useAuthContext } from "../context/AuthContext";

interface StoreItemProps {
  id: string;
  imgUrl: string;
  name: string;
  price: number;
  description: string;
  totalRating: number;
  reviewCount: number;
  category: string;
}

export default function StoreItem({
  id,
  imgUrl,
  name,
  price,
  description,
  totalRating,
  reviewCount,
  category,
}: StoreItemProps) {
  const [size, setSize] = useState<string>("");
  const [isSizeSelected, setIsSizeSelected] = useState(true);
  const { openShoppingCart } = useShopping();
  const { isLogin, openSigninModal } = useAuthContext();
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    if (size === "") {
      setIsSizeSelected(false);
    } else if (isLogin) {
      dispatch(
        addCartItem({
          id,
          name,
          imgUrl,
          size,
          price,
        })
      );
      openShoppingCart(); // Open shoppingCart
    } else {
      openSigninModal(); // Open SigninModal
    }
  };

  // When switching routes, the page reloads, the state without saving in local storage will lose including the redux store state.
  // Use react-router-dom Link component state to transfer data between switching routes.
  // Both Link and useNavigate can use state to transfer data.
  // In the destination page, use useLocation to receive the data.
  return (
    <>
      <Box borderWidth={1} borderRadius="md" shadow="md" minW="17rem">
        <Link
          to={`/itemdetail/${id}`}
          state={{
            name,
            imgUrl,
            price,
            description,
            shoesize: size,
            totalRating,
            reviewCount,
            category,
          }}
        >
          <Image
            src={imgUrl}
            bg="gray.100"
            w="100%"
            h="250px"
            objectFit="contain"
          />
        </Link>
        <Text fontSize="md" fontWeight="bold" mx={6} my={3}>
          {name}
        </Text>
        <Flex align="center" mx={6}>
          <Select
            placeholder="Select Size"
            w="50%"
            size="sm"
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              setIsSizeSelected(true);
            }}
            borderColor={isSizeSelected ? "gray.200" : "red"}
            border={isSizeSelected ? "1px" : "2px"}
          >
            <option value="5.5">5.5</option>
            <option value="6">6</option>
            <option value="6.5">6.5</option>
            <option value="7">7</option>
            <option value="7.5">7.5</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </Select>
          <Spacer />
          <Text fontSize="lg" fontWeight="bold">
            ${price}
          </Text>
        </Flex>
        <Box mx={6} my={5}>
          <Button w="100%" size="sm" colorScheme="pink" onClick={handleAdd}>
            Add to Cart
          </Button>
        </Box>
      </Box>
    </>
  );
}
