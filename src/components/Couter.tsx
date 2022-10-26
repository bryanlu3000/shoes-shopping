import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { IconButton, Flex, Text } from "@chakra-ui/react";

interface CounterProps {
  itemCount: number;
  setItemCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function Counter({ itemCount, setItemCount }: CounterProps) {
  return (
    <Flex
      borderWidth={1}
      borderRadius="md"
      borderColor="gray.300"
      w="7rem"
      justify="space-around"
      align="center"
    >
      <IconButton
        icon={<MinusIcon />}
        variant="link"
        aria-label="Decrease count"
        size="xs"
        color="gray.400"
        _hover={{ color: "gray.600" }}
        onClick={() => setItemCount((prev) => prev - 1)}
      />

      <Text fontSize="md" fontWeight="bold">
        {itemCount}
      </Text>

      <IconButton
        icon={<AddIcon />}
        variant="link"
        aria-label="Increase count"
        size="xs"
        color="gray.400"
        _hover={{ color: "gray.600" }}
        onClick={() => setItemCount((prev) => prev + 1)}
      />
    </Flex>
  );
}
