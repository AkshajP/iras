import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";

interface TypeSelectorProps {
  onSelectType: (selectedType: "all" | "ca" | "classroom" | "lab") => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ onSelectType }) => {
  const [selectedTitle, setSelectedTitle] = useState("Choose Type");

  const handleSelectType = (type: "all" | "ca" | "classroom" | "lab") => {
    let title = "";
    switch (type) {
      case "all":
        title = "All";
        break;
      case "ca":
        title = "Common Area";
        break;
      case "classroom":
        title = "Classroom";
        break;
      case "lab":
        title = "Lab";
        break;
      default:
        title = "Choose Type";
    }
    setSelectedTitle(title);
    onSelectType(type);
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {selectedTitle}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleSelectType("all")} key="all">
          All
        </MenuItem>
        <MenuItem onClick={() => handleSelectType("ca")} key="ca">
          Common Area
        </MenuItem>
        <MenuItem onClick={() => handleSelectType("classroom")} key="classroom">
          Classroom
        </MenuItem>
        <MenuItem onClick={() => handleSelectType("lab")} key="lab">
          Lab
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default TypeSelector;
