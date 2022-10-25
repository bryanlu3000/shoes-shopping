import { Button, Grid, GridItem, Image, Text, VStack } from "@chakra-ui/react";
import Counter from "./Couter";
import { CartItemProps } from "../redux/ShopSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/reduxTypedHooks";
import { updateCartItemCount, removeCartItem } from "../redux/ShopSlice";

export default function CartItem({
  id,
  name,
  imgUrl,
  size,
  price,
  count,
}: CartItemProps) {
  const [itemCount, setItemCount] = useState(count);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (itemCount > 0) {
      dispatch(updateCartItemCount({ id, size, count: itemCount }));
    } else {
      dispatch(removeCartItem({ id, size }));
    }
  }, [itemCount]);

  return (
    <Grid templateColumns="repeat(8, 1fr)" gap={5} alignItems="center">
      <GridItem colSpan={[8, 3]}>
        <Image
          src={imgUrl}
          bg="gray.100"
          w="100%"
          h="120px"
          objectFit="contain"
        />
      </GridItem>
      <GridItem colSpan={[8, 4]}>
        <VStack align="start">
          <Text fontSize="sm" fontWeight="700" noOfLines={1}>
            {name}
          </Text>
          <Text fontSize="sm" fontWeight="600">
            Size: {size}
          </Text>
          <Text fontSize="sm" fontWeight="600">
            ${price}
          </Text>
          <Counter itemCount={itemCount} setItemCount={setItemCount} />
        </VStack>
      </GridItem>
      <GridItem colSpan={[8, 1]}>
        <Button
          colorScheme="green"
          size={["sm", "xs"]}
          onClick={() => dispatch(removeCartItem({ id, size }))}
        >
          Remove
        </Button>
      </GridItem>
    </Grid>
  );
}
