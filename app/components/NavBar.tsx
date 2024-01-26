import { Button, HStack } from "@chakra-ui/react";
import Image from "next/image";
import rvlogo from "../assets/rvlogo.png";
import ColorModeSwitch from "./ColorModeSwitch";
import supabase from "../services/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NavBar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("userData");
    const { error } = await supabase.auth.signOut();
    router.push("/auth/login");
    setLoading(false);
  };

  return (
    <HStack justifyContent="space-between" padding="10px">
      <Image src={rvlogo} width={60} alt="logo" height={60} />
      <Button
        colorScheme="red"
        variant="outline"
        onClick={handleLogout}
        isLoading={loading}
        loadingText="Logging Out"
      >
        Log Out
      </Button>
    </HStack>
  );
};

export default NavBar;
