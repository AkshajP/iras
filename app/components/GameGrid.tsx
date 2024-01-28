import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import UseRoom, { RoomClass } from "../hooks/useRoom";
import useType from "../hooks/useType";
import { Floor } from "./FloorList";
import GameCard from "./GameCard";

interface GameGridProps {
  selectedFloor: Floor | null;
  selectedType: "all" | "ca" | "classroom" | "lab"; //ca = common_area
  selectedDate: Date;
  user: any | null;
}

const GameGrid = ({
  selectedFloor,
  selectedType,
  selectedDate,
  user,
}: GameGridProps) => {
  const { rooms: roomsByFloor, error: errorByFloor } = UseRoom(selectedFloor);
  const { rooms: roomsByType, error: errorByType } = useType(selectedType);
  const finalrooms = mergeRooms(roomsByFloor, roomsByType);

  return (
    <>
      {(errorByFloor || errorByType) && (
        <Text>{errorByFloor || errorByType}</Text>
      )}
      <SimpleGrid columns={3} spacing={10}>
        {finalrooms?.map((room) => (
          <Box key={room.room_number} width="100%" height="100%">
            <GameCard
              user={user}
              key={room.room_number}
              room={room}
              selectedDate={selectedDate}
            />
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
};
//templateColumns='repeat(auto-fill, minmax(250px, 1fr)) alignContent = 'space-evenly''
const mergeRooms = (
  roomsByFloor: RoomClass[],
  roomsByType: RoomClass[]
): RoomClass[] => {
  const roomNumbersByFloor = roomsByFloor.map((room) => room.room_number);
  const roomNumbersByType = roomsByType.map((room) => room.room_number);
  const intersectedRoomNumbers = roomNumbersByFloor.filter((roomNumber) =>
    roomNumbersByType.includes(roomNumber)
  );
  const intersectedRooms = roomsByType.filter((room) =>
    intersectedRoomNumbers.includes(room.room_number)
  );
  return intersectedRooms;
};

export default GameGrid;
