import {
  Image,
  Text,
  Grid,
  GridItem,
  VStack,
  Select,
  Button,
  Container,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAppDispatch } from "../redux/reduxTypedHooks";
import { addCartItem } from "../redux/ShopSlice";
import { useShopping } from "../context/ShoppingContext";

export default function ItemDetail() {
  const { id } = useParams();

  // Receive the item details from react-router-dom Link state via useLocation()
  const location = useLocation();
  const { name, imgUrl, price, description, shoesize } = location.state;

  const [size, setSize] = useState<string>(shoesize || "");
  const [isSizeSelected, setIsSizeSelected] = useState(true);
  const { setIsHomepage, onOpen } = useShopping();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsHomepage(false);
  }, []);

  const handleAdd = () => {
    if (size === "") {
      setIsSizeSelected(false);
    } else {
      dispatch(
        addCartItem({
          id,
          name,
          imgUrl,
          size,
          price,
        })
      );
      onOpen();
    }
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
      </Container>
    </main>
  );
}
