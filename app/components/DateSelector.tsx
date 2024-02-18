import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuList, Button } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";

interface DateSelectorProps {
  onSelectDate: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onSelectDate }) => {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const generateDateOptions = () => {
    const dateOptions = [];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + i);
      dateOptions.push(nextDate);
    }

    return dateOptions;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(new Date(date));
    onSelectDate(date);
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {selectedDate ? selectedDate.toDateString() : "Select Date"}
      </MenuButton>
      <MenuList>
        {generateDateOptions().map((date) => (
          <MenuItem
            key={date.toDateString()}
            onClick={() => handleDateSelect(date)}
          >
            {date.toDateString()}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default DateSelector;
