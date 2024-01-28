"use client";

// This page doesnt work yet

import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import rvlogo from "../../assets/rvlogo.png";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  VStack,
  Button,
  Container,
  StackDivider,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  Center,
  Heading,
} from "@chakra-ui/react";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const router = useRouter();

  const handleSignUp = async (event: any) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(
        (typeof window !== "undefined" && localStorage.getItem("userData")) ||
          "{}"
      );
      if (user.priority === 1) {
        router.push("/student");
      } else if (user.priority === 2) {
        router.push("/teacher");
      } else if (user.priority === 3) {
        router.push("/admin");
      }
    }
  });

  return (
    <>
      <Container width="400px">
        <VStack divider={<StackDivider />} spacing={5} align="stretch">
          <Box h="30vh">
            <Center>
              <Image src={rvlogo} width={150} alt="logo" height={150} />
            </Center>
            <Center>
              <Heading as="h1" size="4xl">
                IRAS - NOT WORKING SIGN UP
              </Heading>
            </Center>
          </Box>

          <Box>
            <FormControl as="form" onSubmit={handleSignUp}>
              <FormLabel>Email</FormLabel>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <FormHelperText></FormHelperText>
              <FormLabel>Password</FormLabel>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Alert
                  status="error"
                  style={{
                    borderRadius: "10px",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <AlertIcon />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}
              <Button
                type="submit"
                mt={4}
                colorScheme="teal"
                isLoading={loading}
                loadingText={"Logging In"}
              >
                Sign Up
              </Button>
            </FormControl>
          </Box>
          <Box h="40px" />
        </VStack>
      </Container>
    </>
  );
}
