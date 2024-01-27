import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
} from "@chakra-ui/react";

interface AddRoomProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (roomDetails: RoomDetails) => void;
}

interface RoomDetails {
  room_number: string;
  class: string;
  floor: number;
  common_area: boolean;
}

const AddRoom: React.FC<AddRoomProps> = ({ isOpen, onClose, onAddRoom }) => {
  const [roomDetails, setRoomDetails] = useState<RoomDetails>({
    room_number: "",
    class: "",
    floor: 0,
    common_area: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setRoomDetails((prevDetails) => ({
      ...prevDetails,
      [name]:
        name === "floor"
          ? parseInt(value, 10) // Parse as integer or default to 0
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  const handleAddRoom = () => {
    // Perform validation if needed
    onAddRoom(roomDetails);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Room Number</FormLabel>
            <Input
              type="text"
              name="room_number"
              value={roomDetails.room_number}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Class</FormLabel>
            <Input
              type="text"
              name="class"
              value={roomDetails.class}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Floor</FormLabel>
            <Input
              type="number"
              name="floor"
              value={roomDetails.floor}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Is Common Area</FormLabel>
            <Checkbox
              name="common_area"
              isChecked={roomDetails.common_area}
              onChange={handleInputChange}
            >
              Common Area
            </Checkbox>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleAddRoom}>
            Add Room
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddRoom;
