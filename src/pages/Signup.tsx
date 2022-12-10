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
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import validateInput from "../utilities/validateInput";
import { useAuthContext } from "../context/AuthContext";
import SignupSuccessModal from "../components/SignupSuccessModal";

interface Input {
  email?: string;
  password?: string;
  matchPassword?: string;
}

export default function Signup() {
  const [input, setInput] = useState<Input>({});
  const [inputErr, setInputErr] = useState<Input>({});
  const [serverErr, setServerErr] = useState("");

  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure(); // Control open/close SignupSuccessModal
  const { signUp } = useAuthContext();

  useEffect(() => {
    setServerErr("");
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const err = validateInput(input, true); // second argument is isSignup: boolean
    setInputErr(err);

    if (Object.keys(err).length === 0) {
      signUp({
        email: input.email!,
        password: input.password!,
        setServerErr,
        callback: onOpen,
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
          Sign up
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
                  type={showPwd1 ? "text" : "password"}
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
                    onClick={() => setShowPwd1(!showPwd1)}
                  >
                    {showPwd1 ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{inputErr.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!inputErr.matchPassword}>
              <FormLabel>Confirm password</FormLabel>
              <InputGroup size="md">
                <Input
                  type={showPwd2 ? "text" : "password"}
                  name="matchPassword"
                  placeholder="Re-enter password"
                  value={input.matchPassword || ""}
                  onChange={handleChange}
                  errorBorderColor="red.500"
                  shadow="sm"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPwd2(!showPwd2)}
                  >
                    {showPwd2 ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{inputErr.matchPassword}</FormErrorMessage>
            </FormControl>
          </VStack>

          <Button type="submit" colorScheme="teal" w="100%" mt={10}>
            Sign up
          </Button>
        </form>

        <Text textAlign="center" fontSize="sm" fontWeight="400" mt={10}>
          Already registered?{" "}
          <Link to="/signin" style={{ color: "red", fontWeight: "500" }}>
            Sign in
          </Link>
        </Text>
      </Container>

      <SignupSuccessModal isOpen={isOpen} onClose={onClose} />
    </Center>
  );
}
