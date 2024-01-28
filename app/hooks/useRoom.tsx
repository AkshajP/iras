import { Floor } from "../components/FloorList";
import queryApi from "../services/query-api";

export interface RoomClass {
  room_number: string;
  class: string;
  floor: number;
  common_area: boolean;
  type: number;
}

const UseRoom = (selectedFloor: Floor | null) => {
  const fetchRoomData = queryApi("rooms");
  const rooms = fetchRoomData.data.map((roomData) => {
    const {
      room_number,
      class: roomClass,
      floor,
      common_area,
      type,
    } = roomData;
    const room: RoomClass = {
      room_number,
      class: roomClass,
      floor,
      common_area,
      type,
    };
    return room;
  });
  const error = fetchRoomData.error;

  const filteredRooms =
    selectedFloor && selectedFloor.floor !== null
      ? (rooms as RoomClass[]).filter(
          (room) => room.floor === selectedFloor.floor
        )
      : rooms;

  return { rooms: filteredRooms, error };
};

export default UseRoom;

// const filteredRooms = selectedFloor ? rooms.filter((room) => room.floor === selectedFloor.floor)
// : rooms;
// const filteredRooms = selectedFloor ? (rooms as RoomClass[]).filter((room) => room.floor === selectedFloor.floor)
// : (rooms as RoomClass[]);
