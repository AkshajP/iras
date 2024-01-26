// components/CardModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Textarea,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import useReservations from "../hooks/useReservations";
import { RoomClass } from "../hooks/useRoom";
import { Reserve } from "../services/Reserve";
import { useRouter } from "next/navigation";

interface CardModalProps {
  onClose: () => void;
  onChange: (change: number) => void;
  change: number;
  room: RoomClass;
  date: Date;
  user: any;
}

const CardModal: React.FC<CardModalProps> = ({
  user,
  date,
  onClose,
  room,
  onChange,
  change,
}) => {
  const reservations = useReservations(date, room.room_number);
  const [reason, setReason] = useState<string>("");
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const timeslots = [1, 2, 3, 4, 5, 6, 7];
  const timeslotDescription: string[] = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:20 AM - 12:20 PM",
    "12:20 PM - 1:20 PM",
    "1:20 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];
  const router = useRouter();

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReason(event.target.value);
  };

  const handleCheckboxChange = (timeslot: number) => {
    setSelectedSlots((prevSelectedSlots) => {
      const isSelected = prevSelectedSlots.includes(timeslot);

      if (isSelected) {
        return prevSelectedSlots.filter(
          (selectedBlock) => selectedBlock !== timeslot
        );
      } else {
        return [...prevSelectedSlots, timeslot];
      }
    });
  };

  const handleClick = async (
    selectedSlots: number[],
    room_number: string,
    reason: string,
    date: Date
  ) => {
    //const date = new Date();
    try {
      const result = await Reserve(
        selectedSlots,
        room_number,
        reason,
        date,
        user
      );
      const newchange = change + 1;
      onChange(newchange);

      alert("reservation successful");
      renderCheckBoxes();
    } catch (error) {
      console.error("Reservation failed", error);
    } finally {
      onClose();
    }
  };

  const renderCheckBoxes = () => {
    return timeslots.map((timeslot) => {
      const reservation = reservations.Reservation.find(
        (reservation) => reservation.timeslot === timeslot
      );
      const isBookable =
        !reservation || user.priority > reservation.occupier_priority;
      const isOverBookable =
        reservation && user.priority > reservation.occupier_priority;
      return (
        <HStack key={timeslot}>
          <Checkbox
            isChecked={selectedSlots.includes(timeslot)}
            isDisabled={!isBookable}
            onChange={() => handleCheckboxChange(timeslot)}
          ></Checkbox>
          <Text
            color={
              isOverBookable
                ? "yellow.100"
                : isBookable
                  ? "green.400"
                  : "gray.400"
            }
          >
            {timeslotDescription[timeslot - 1]}
            {reservation && isOverBookable
              ? " (Booked reason: " + reservation.reason + ")"
              : ""}
            {reservation && reservation.occupier_id === user.id
              ? " (Already booked by you)"
              : reservation
                ? ""
                : ""}
          </Text>
        </HStack>
      );
    });
  };

  return (
    <Modal isOpen onClose={onClose} isCentered>
      <ModalContent>
        <ModalHeader fontSize="xl" fontWeight="bold">
          {room.room_number}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="left">{renderCheckBoxes()}</VStack>
          <Textarea
            placeholder="Enter your reason for booking..."
            value={reason}
            onChange={handleTextareaChange}
            mt={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isDisabled={reason && selectedSlots.length > 0 ? false : true}
            onClick={() =>
              handleClick(selectedSlots, room.room_number, reason, date)
            }
          >
            Reserve
          </Button>
          <Button colorScheme="blue" onClick={onClose} ml={4}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CardModal;
