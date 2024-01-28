import queryApi from "../services/query-api";
import { RoomClass } from "./useRoom";

const useType = (selectedType: "all" | "ca" | "classroom" | "lab") => {
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
      type, //1:classroom, 2:lab, 3:common
    };
    return room;
  });
  const error = fetchRoomData.error;
  const filteredRooms = rooms.filter((room) => {
    if (selectedType === "ca") {
      return room.type === 3 ? true : false;
    } else if (selectedType === "lab") {
      return room.type === 2 ? true : false;
    } else if (selectedType === "classroom") {
      return room.type === 1 ? true : false;
    } else return true;

    // if (selectedType === "ca") {
    //   return room.common_area;
    // } else if (selectedType === "classroom") {
    //   return !room.common_area;
    // } else {
    //   return true;
    // }
  });

  return { rooms: filteredRooms, error };
};

export default useType;
