import React, { useState } from "react";
import {
  Input,
  List,
  ListItem,
  ListIcon,
  Box,
  Collapse,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface FilterableDropdownProps {
  options: string[];
  onSelect: (selectedOption: string) => void;
}

const FilterableDropdown: React.FC<FilterableDropdownProps> = ({
  options,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setSearchTerm(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <Box position="relative">
      <InputGroup>
        <Input
          placeholder="Type to filter..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          size="md"
          pr="4.5rem"
          borderRadius="md"
          variant="filled"
        />
        <InputRightElement
          width="4.5rem"
          pointerEvents="none"
          children={<SearchIcon color="gray.500" />}
        />
      </InputGroup>
      <Collapse in={isOpen}>
        <List
          position="absolute"
          top="100%"
          left={0}
          zIndex={1}
          width="100%"
          backgroundColor="gray.700"
          border="1px"
          borderColor="gray.600"
          borderRadius="md"
          boxShadow="sm"
          style={{ overflowY: "scroll", maxHeight: "200px" }}
        >
          {filteredOptions.map((option, index) => (
            <ListItem
              key={index}
              p={2}
              _hover={{ bg: "gray.600" }}
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default FilterableDropdown;
