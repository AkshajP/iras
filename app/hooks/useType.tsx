import queryApi from "../services/query-api";
import { RoomClass } from "./useRoom";

const useType = (selectedType:'all' | 'ca' | 'classroom') => {
    const fetchRoomData = queryApi("rooms");
    const rooms = fetchRoomData.data.map((roomData) => {
      const { room_number, class: roomClass, floor, common_area } = roomData;
      const room: RoomClass = {
        room_number,
        class: roomClass,
        floor,
        common_area
      };
      return room;
    });
    const error = fetchRoomData.error;
    const filteredRooms = rooms.filter((room) => {
        if (selectedType === 'ca') {
            return room.common_area;
        } else if (selectedType === 'classroom') {
            return !room.common_area;
        } else {
            return true;
        }
    });
    //console.log(filteredRooms)
    
    
  return {rooms: filteredRooms, error}
}

export default useType