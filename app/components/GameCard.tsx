import { Card, CardBody, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { RoomClass } from "../hooks/useRoom";
import { User } from "../services/AuthContext";
import CardModal from "./CardModal";
import ReservationBlocks from "./ReservationBlocks";
import { useRouter } from "next/navigation";

interface RoomProps {
  room: RoomClass;
  selectedDate: Date;
  user: User | null;
}

const GameCard = ({ room, selectedDate, user }: RoomProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [change, setChange] = useState(0);
  const router = useRouter();

  const handleClick = () => {
    console.log("clicked");
    setIsModalOpen(true);
    //IMPORT THE MODAL AND PASS PARAMETERS
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

//
//height='200x' width='400px'

export default GameCard;
