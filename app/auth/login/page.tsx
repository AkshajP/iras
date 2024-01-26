"use client";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
} from "@chakra-ui/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    console.log(email, password);

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(data, error);

    if (error) {
      console.error("Error signing in:", error.message);
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
      router.push("/teacher");
    } else if (studentData) {
      // User is a student
      localStorage.setItem("userRole", "student");
      localStorage.setItem("userData", JSON.stringify(studentData));
      router.push("/student");
    } else if (adminData) {
      // User is an admin
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userData", JSON.stringify(adminData));
      router.push("/admin");
    } else {
      // User not found in any table
      console.error("User not found in any table");
    }
  };

  return (
    <>
      <Container width="400px">
        <VStack divider={<StackDivider />} spacing={5} align="stretch">
          <Box h="30vh" />

          <Box>
            <FormControl as="form" onSubmit={handleSignIn}>
              <FormLabel>Email</FormLabel>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormHelperText></FormHelperText>
              <FormLabel>Password</FormLabel>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" mt={4} colorScheme="teal">
                Submit
              </Button>
            </FormControl>
          </Box>
          <Box h="40px" />
        </VStack>
      </Container>
    </>
  );
}
