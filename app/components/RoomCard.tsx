import { Card, CardBody, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { RoomClass } from "../hooks/useRoom";
import CardModal from "./CardModal";
import ReservationBlocks from "./ReservationBlocks";
import { useRouter } from "next/navigation";

interface RoomProps {
  room: RoomClass;
  selectedDate: Date;
  user: any;
}

const RoomCard = ({ room, selectedDate, user }: RoomProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [change, setChange] = useState(0);
  const router = useRouter();

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        <Card background="gray.700">
          <CardBody>
            <Heading>{room.room_number}</Heading>
            {room.class}
            <br />
            <ReservationBlocks
              change={change}
              roomNumber={room.room_number}
              selectedDate={selectedDate}
            />
          </CardBody>
        </Card>
      </div>
      {isModalOpen && (
        <CardModal
          change={change}
          onChange={(change) => setChange(change)}
          user={user}
          date={selectedDate}
          room={room}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default RoomCard;
