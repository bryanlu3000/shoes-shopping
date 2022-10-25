import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Center, Flex, Text } from "@chakra-ui/react";

interface CounterProps {
  itemCount: number;
  setItemCount: React.Dispatch<React.SetStateAction<number>>;
}

export default function Counter({ itemCount, setItemCount }: CounterProps) {
  return (
    <Flex
      borderWidth={1}
      borderRadius="sm"
      borderColor="gray.300"
      w="6rem"
      justify="space-around"
    >
      <Center>
        <MinusIcon
          color="gray.400"
          fontSize="xs"
          onClick={() => setItemCount((prev) => prev - 1)}
        />
      </Center>

      <Text fontSize="md" fontWeight="bold">
        {itemCount}
      </Text>

      <Center>
        <AddIcon
          color="gray.400"
          fontSize="xs"
          onClick={() => setItemCount((prev) => prev + 1)}
        />
      </Center>
    </Flex>
  );
}
