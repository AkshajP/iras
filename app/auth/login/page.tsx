"use client";
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
  AlertDescription,
  Center,
  Heading,
} from "@chakra-ui/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const router = useRouter();

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      setError(error.message);
      setLoading(false);
      // Handle error appropriately (e.g., show an error message to the user)
      return;
    }

    // Check if the user is a teacher, student, or admin
    const { data: teacherData, error: teacherError } = await supabase
      .from("teacher")
      .select("*")
      .eq("email", email)
      .single();

    const { data: studentData, error: studentError } = await supabase
      .from("student")
      .select("*")
      .eq("email", email)
      .single();

    const { data: adminData, error: adminError } = await supabase
      .from("admin")
      .select("*")
      .eq("email", email)
      .single();

    // Determine the user role and store data in localStorage
    if (teacherData) {
      // User is a teacher
      localStorage.setItem("userRole", "teacher");
      localStorage.setItem("userData", JSON.stringify(teacherData));
      setLoading(false);
      router.push("/teacher");
    } else if (studentData) {
      // User is a student
      localStorage.setItem("userRole", "student");

      const sData = { ...studentData };
      sData.id = studentData.usn; // Assuming `usn` is the property you want to use for the `id`
      localStorage.setItem("userData", JSON.stringify(sData));
      setLoading(false);
      router.push("/student");
    } else if (adminData) {
      // User is an admin
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userData", JSON.stringify(adminData));
      setLoading(false);
      router.push("/admin");
    } else {
      // User not found in any table

      setError("User not found");
      setLoading(false);
      localStorage.clear();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("userData") || "{}");

      if (user.priority === 1) {
        router.push("/student");
      } else if (user.priority === 2) {
        router.push("/teacher");
      } else if (user.priority === 3) {
        router.push("/admin");
      } else {
        router.push("/auth/login");
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
                IRAS
              </Heading>
            </Center>
          </Box>

          <Box>
            <FormControl as="form" onSubmit={handleSignIn}>
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
                Log In
              </Button>
            </FormControl>
          </Box>
          <Box h="40px" />
        </VStack>
      </Container>
    </>
  );
}
