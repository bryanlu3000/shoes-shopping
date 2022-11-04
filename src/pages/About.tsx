import {
  Box,
  Center,
  Heading,
  Text,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import bgImage from "../assets/imgs/about-bkgd.png";

export default function About() {
  return (
    <Box
      h="94.2vh"
      bg="blackAlpha.600"
      bgBlendMode="multiply"
      bgImage={bgImage}
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      <Center
        w="100%"
        h="100%"
        backdropFilter="auto"
        backdropBlur="10px"
        flexDirection="column"
        color="whiteAlpha.900"
      >
        <Grid templateColumns="repeat(5, 1fr)" mx={12}>
          <GridItem colStart={[1, 1, 3]} colSpan={[5, 5, 3]}>
            <Heading mb={12} w="80%">
              This website is only for learning and demo purpose. All the images
              are only used for learning, no any comercial use.
            </Heading>

            <Flex direction="column" gap={2}>
              <Flex gap={3}>
                <Text fontSize="lg" as="b">
                  UI Design:
                </Text>
                <Text fontSize="lg">CSS, Charkra UI</Text>
              </Flex>

              <Flex gap={3}>
                <Text fontSize="lg" as="b">
                  Frontend:
                </Text>
                <Text fontSize="lg">React.js, Redux</Text>
              </Flex>

              <Flex gap={3}>
                <Text fontSize="lg" as="b">
                  Backend:
                </Text>
                <Text fontSize="lg">Express.js, MongoDB</Text>
              </Flex>
            </Flex>

            <Flex gap={3} mt={10}>
              <Text fontSize="xl" as="b">
                Contact me:
              </Text>
              <Text fontSize="xl">bryan.lu3000@gmail.com</Text>
            </Flex>
          </GridItem>
        </Grid>
      </Center>
    </Box>
  );
}
