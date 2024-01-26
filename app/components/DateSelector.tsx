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

    for (let i = 0; i < 28; i++) {
      const nextDate = new Date();
      nextDate.setDate(currentDate.getDate() + i);
      dateOptions.push(nextDate);
    }

    return dateOptions;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(new Date(date));
    onSelectDate(date);
    // You can perform additional actions here when a date is selected
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {selectedDate ? selectedDate.toDateString() : "Select Date"}
      </MenuButton>
      <MenuList style={{ overflowY: "scroll", maxHeight: "300px" }}>
        {generateDateOptions().map((date) => (
          <MenuItem
            key={date.toISOString().split("T")[0]}
            onClick={() => handleDateSelect(date)}
          >
            {date.toISOString().split("T")[0]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default DateSelector;
