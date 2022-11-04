import {
  Center,
  Container,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Checkbox,
  Link,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import validateInput from "../utilities/validateInput";
import { useAuthContext } from "../context/AuthContext";

interface Input {
  email?: string;
  password?: string;
}

export default function Signin() {
  const [input, setInput] = useState<Input>({});
  const [inputErr, setInputErr] = useState<Input>({});
  const [serverErr, setServerErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuthContext();

  useEffect(() => {
    setServerErr("");
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navToPrevPage = () => navigate(-1);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const err = validateInput(input, false); // second argument is isSignup: boolean
    setInputErr(err);

    if (Object.keys(err).length === 0) {
      signIn({
        email: input.email!,
        password: input.password!,
        setServerErr,
        callback: navToPrevPage,
      });
    }
  };

  return (
    <Center h="90vh">
      <Container
        minW="20rem"
        borderWidth="2px"
        borderRadius="lg"
        shadow="lg"
        p={12}
      >
        <Text color="red.500" fontSize="xl" fontWeight="500" textAlign="center">
          {serverErr}
        </Text>
        <Text fontSize="3xl" fontWeight="500" textAlign="center">
          Sign in
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack mt={10} spacing={6} align="start">
            <FormControl isInvalid={!!inputErr.email}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter email"
                value={input.email || ""}
                onChange={handleChange}
                errorBorderColor="red.500"
                shadow="sm"
              />
              <FormErrorMessage>{inputErr.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!inputErr.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={input.password || ""}
                  onChange={handleChange}
                  errorBorderColor="red.500"
                  shadow="sm"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{inputErr.password}</FormErrorMessage>
            </FormControl>

            <Checkbox>Remember me?</Checkbox>
          </VStack>

          <Button type="submit" colorScheme="teal" w="100%" mt={10}>
            Sign in
          </Button>
        </form>

        <Text textAlign="center" fontSize="sm" fontWeight="400" my={10}>
          Don't have an account?{" "}
          <Link href="/signup" color="red.500" fontWeight="500">
            Sign up
          </Link>
        </Text>
      </Container>
    </Center>
  );
}
