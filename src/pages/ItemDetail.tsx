import {
  Image,
  Text,
  Grid,
  GridItem,
  VStack,
  Select,
  Button,
  Container,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAppDispatch } from "../redux/reduxTypedHooks";
import { addCartItem } from "../redux/ShopSlice";
import { useShopping } from "../context/ShoppingContext";
import { useAuthContext } from "../context/AuthContext";
import SigninModal from "../components/SigninModal";
import ReviewRating from "../components/ReviewRating";
import ReviewRatingModal from "../components/ReviewRatingModal";

export default function ItemDetail() {
  const { id } = useParams();

  // When openning this new page, redux state will be lost. If you do not want to refetch data from backend, you can use useLocation to transfer data via url.
  // Receive the item details from react-router-dom Link state via useLocation()
  const location = useLocation();
  const {
    name,
    imgUrl,
    price,
    description,
    totalRating,
    reviewCount,
    shoesize,
  } = location.state;

  const [localTotalRating, setLocalTotalRating] = useState<number>(totalRating);
  const [localReviewCount, setLocalReviewCount] = useState<number>(reviewCount);

  const [size, setSize] = useState<string>(shoesize || "");
  const [isSizeSelected, setIsSizeSelected] = useState(true);
  const { openShoppingCart, addItemRating } = useShopping();
  const { isLogin, openSigninModal } = useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Control open/close ReviewRatingModal
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
      openShoppingCart();
    } else {
      openSigninModal();
    }
  };

  const onClickReviewRating = () => {
    if (isLogin) {
      onOpen();
    } else {
      openSigninModal();
    }
  };

  const callbackReviewRatingModal = (rating: number) => {
    const callbackAddItemRating = () => {
      // After updating the rating to the backend, then update the local state accordingly for a quick display. Next time when reloading this page, the rating value will be received from the backend.
      setLocalTotalRating((prev) => prev + rating);
      setLocalReviewCount((prev) => prev + 1);
    };

    addItemRating({ id: id!, rating, callback: callbackAddItemRating });
  };

  return (
    <main>
      <Container width="85%" minW="16rem" maxW="75rem" mt={[8, 16, 32]}>
        <Grid
          templateColumns="repeat(5, 1fr)"
          gap={[2, 4, 16, 12, 20]}
          alignItems="center"
        >
          <GridItem colSpan={[5, 5, 3]}>
            <Image
              src={imgUrl}
              bg="gray.100"
              borderRadius="xl"
              p={5}
              objectFit="contain"
              boxSize={[250, 500, 450, 500, 600]}
            />
          </GridItem>

          <GridItem colSpan={[5, 5, 2]}>
            <VStack align="start" spacing={[2, 2, 2, 5, 10]}>
              <Text
                fontSize="2xl"
                fontWeight="700"
                color="gray.700"
                noOfLines={1}
              >
                {name}
              </Text>

              <ReviewRating
                rating={Math.round(localTotalRating / localReviewCount)}
                reviewCount={localReviewCount}
                onClick={onClickReviewRating}
              />

              <Text fontSize="xl" fontWeight="600" color="gray.600">
                {`$${price}`}
              </Text>

              <Select
                placeholder="Select Size"
                w="50%"
                size="sm"
                value={size}
                onChange={(e) => {
                  setSize(e.target.value);
                  setIsSizeSelected(true);
                }}
                borderColor={isSizeSelected ? "gray.300" : "red"}
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

              <VStack align="start" spacing={2}>
                <Text
                  fontSize={["sm", "sm", "sm", "md"]}
                  fontWeight="700"
                  color="gray.700"
                >
                  Description
                </Text>
                <Text
                  fontSize={["sm", "sm", "sm", "md"]}
                  fontWeight="400"
                  color="gray.600"
                  noOfLines={7}
                >
                  {description}
                </Text>
              </VStack>
            </VStack>
            <Button
              w="100%"
              size="sm"
              mt={[4, 6, 8, 12, 20]}
              colorScheme="pink"
              onClick={handleAdd}
            >
              Add to Cart
            </Button>
          </GridItem>
        </Grid>

        <SigninModal />
        <ReviewRatingModal
          isOpen={isOpen}
          onClose={onClose}
          callback={callbackReviewRatingModal}
        />
      </Container>
    </main>
  );
}
