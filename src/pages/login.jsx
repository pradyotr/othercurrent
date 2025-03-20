import { useEffect, useState } from "react";
import { Box, Input, Button, VStack, Heading, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { PasswordInput } from "../components/ui/password-input";
import { useColorMode } from "../components/ui/color-mode";
import { useAuth } from "../hooks/useAuth";
import logo from "/src/assets/Logo_Unique_Lables.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  return (
    <Box w="100vw" h="100vh">
      <Box
        position="absolute"
        top="0"
        py="2"
        px="8"
        bg="white"
        zIndex="5"
      >
        <Image src={logo} height="100px" />
      </Box>
      <Box
        h={{ base: "4/5" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            login(username, password);
          }}
          w={{ base: "4/5" }}
          maxW="400px"
          bg="gray.50"
          rounded="lg"
          background={useColorMode("white", "gray.800")}
        >
          <VStack spacing="4" align="center">
            <Heading size="2xl" p="4">
              Login
            </Heading>
            <Input
              type="text"
              placeholder="Username"
              variant="subtle"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              w="full"
              h="12"
              size="md"
            />
            <PasswordInput
              placeholder="Password"
              variant="subtle"
              value={password}
              color={useColorMode("gray.800", "white")}
              onChange={(e) => setPassword(e.target.value)}
              w="full"
              h="12"
              size="md"
            />
            <Button variant="outline" type="submit" w="full" h="12" size="md">
              Login
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
