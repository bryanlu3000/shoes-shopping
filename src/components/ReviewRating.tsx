import { Flex, Box } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

interface ReviewRatingProps {
  rating: number;
  reviewCount: number;
  onClick: () => void;
}

export default function ReviewRating({
  rating,
  reviewCount,
  onClick,
}: ReviewRatingProps) {
  return (
    <Flex mt="2" alignItems="center" cursor="pointer" onClick={onClick}>
      {Array(5)
        .fill("")
        .map((_, i) => (
          <StarIcon
            key={i}
            color={i + 1 <= rating ? "teal.500" : "gray.300"}
            me="1px"
          />
        ))}

      <Box as="span" ml="2" color="gray.600" fontSize="sm" fontWeight="500">
        {reviewCount} reviews
      </Box>
    </Flex>
  );
}
