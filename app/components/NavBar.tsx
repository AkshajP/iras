import { HStack } from "@chakra-ui/react";
import Image from "next/image";
import rvlogo from "../assets/rvlogo.png";
import ColorModeSwitch from "./ColorModeSwitch";

const NavBar = () => {
  return (
    <HStack justifyContent="space-between" padding="10px">
      <Image src={rvlogo} width={60} alt="logo" height={60} />
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
