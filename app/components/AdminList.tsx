import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import supabase from "../services/client";
import { useEffect, useState } from "react";

export interface Floor {
  floor: number | null;
  text: string;
}

interface FloorListProps {
  onSelectFloor: (floor: Floor) => void;
  selectedFloor: Floor | null;
}

const AdminFloorList: React.FC<FloorListProps> = ({
  selectedFloor,
  onSelectFloor,
}) => {
  const floorMapping: { [floor: number]: string } = {
    0: "Ground Floor",
    1: "1st Floor",
    2: "2nd Floor",
    3: "3rd Floor",
    4: "4th Floor",
    5: "5th Floor",
    6: "6th Floor",
    7: "7th Floor",
  };

  const router = useRouter();
  const user = JSON.parse(
    (typeof window !== "undefined" && localStorage.getItem("userData")) || "{}"
  );

  const floors: Floor[] = [
    { floor: null, text: "All Floors" },
    ...Object.entries(floorMapping).map(([floor, text]) => ({
      floor: parseInt(floor, 10),
      text,
    })),
  ];

  const [message, setMessage] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }, [message]);

  const setTT = async () => {
    let { data, error } = await supabase.rpc("SetTimetableReservations");
    if (error) setMessage(error.message);
    else {
      const nextWeekDate = new Date();
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      setMessage(
        "Timetable Set Successfully for " +
          nextWeekDate.toISOString().split("T")[0]
      );
    }
  };

  return (
    <>
      <List>
        <Text fontSize="large">
          <ListItem marginLeft={10} paddingY={2}>
            <Button
              width={150}
              fontSize="lg"
              onClick={setTT}
              colorScheme="purple"
            >
              Set Next Day TT
            </Button>
          </ListItem>
          <ListItem marginLeft={10} paddingY={2}>
            <Button
              width={150}
              fontSize="lg"
              onClick={() => router.push("/admin/manage/rooms")}
              colorScheme="purple"
            >
              Manage Rooms
            </Button>
          </ListItem>
          <ListItem marginLeft={10} paddingY={2}>
            <Button
              width={150}
              fontSize="lg"
              onClick={() => router.push("/admin/manage/timetable")}
              colorScheme="purple"
            >
              Manage TT
            </Button>
          </ListItem>
          <ListItem marginLeft={10} paddingY={2}>
            <Button
              width={150}
              fontSize="lg"
              onClick={() => router.push("/admin/manage/teachers")}
              colorScheme="purple"
            >
              Manage Teachers
            </Button>
          </ListItem>

          {floors.map((floor) => (
            <ListItem marginLeft={10} paddingY={2} key={floor.floor}>
              <Button
                fontWeight={
                  floor.floor === selectedFloor?.floor ? "bold" : "normal"
                }
                fontSize="lg"
                onClick={() => onSelectFloor(floor)}
                background={
                  floor.floor === selectedFloor?.floor ? "teal.500" : "gray.700"
                }
                width={150}
              >
                {floor.text}
              </Button>
            </ListItem>
          ))}
        </Text>
      </List>
      {message && (
        <Alert
          status="success"
          style={{
            position: "fixed",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "500px",
            borderRadius: "10px",
            backgroundColor: "#48BB78",
          }}
        >
          <AlertIcon />
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      )}
    </>
  );
};

export default AdminFloorList;
