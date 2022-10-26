import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Button,
  Center,
  Text,
  Tag,
  Spacer,
  VStack,
  StackDivider,
} from "@chakra-ui/react";
import CartItem from "./CartItem";
import { useAppSelector } from "../redux/reduxTypedHooks";
import { getCartItems, getCartItemsAmount } from "../redux/ShopSlice";
import { useShopping } from "../context/ShoppingContext";

export default function ShoppingCart() {
  const { isOpen, onClose } = useShopping();
  const cartItems = useAppSelector(getCartItems);
  const cartItemsAmount = useAppSelector(getCartItemsAmount);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Cart</DrawerHeader>

        <DrawerBody>
          {cartItems.length > 0 ? (
            <VStack
              spacing={4}
              divider={<StackDivider borderColor="gray.200" />}
            >
              {cartItems.map((item) => (
                <CartItem key={item.id + item.size} {...item} />
              ))}
            </VStack>
          ) : (
            <Center my={12}>
              <Text fontSize="xl" fontWeight="bold">
                Your cart is empty
              </Text>
            </Center>
          )}
        </DrawerBody>

        <DrawerFooter>
          <Tag
            size="lg"
            borderRadius="full"
            variant="solid"
            colorScheme="green"
            me={2}
          >
            Total:
          </Tag>
          <Text fontSize="xl" fontWeight="500">
            ${cartItemsAmount.toFixed(2)}
          </Text>
          <Spacer />
          <Button variant="outline" mr={3} size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" size="sm">
            Checkout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
