import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import supabase from "../services/client";

interface Reservation {
  rid: number;
  date: Date;
  room_no: string;
  reason: string;
  occupier_id: string;
  occupier_priority: string;
  timeslot: number;
}

interface ReservationBlocksProps {
  roomNumber: string;
  selectedDate: Date;
  change: number;
}

const FetchReservations = async (selectedDate: Date, roomNumber: string) => {
  const formattedDate = selectedDate.toISOString().split("T")[0];
  try {
    const { data, error } = await supabase
      .from("reservation")
      .select("*")
      .eq("date", formattedDate)
      .eq("room_no", roomNumber);

    return { data: data || [], error };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], error };
  }
};
const user = JSON.parse(
  (typeof window !== "undefined" && localStorage.getItem("userData")) || "{}"
);
const useReservations = (
  selectedDate: Date,
  roomNumber: string,
  change: number
) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await FetchReservations(selectedDate, roomNumber);
      setReservations(
        data.map((reservationData) => ({
          ...reservationData,
          date: new Date(reservationData.date),
        }))
      );
      setError(error);
    };

    fetchData();
  }, [selectedDate, roomNumber, change]);

  return { reservations, error };
};

const ReservationBlocks = ({
  roomNumber,
  selectedDate,
  change,
}: ReservationBlocksProps) => {
  const timeslotDescriptions: string[] = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:20 AM - 12:20 PM",
    "12:20 PM - 1:20 PM",
    "1:20 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  const { reservations, error } = useReservations(
    selectedDate,
    roomNumber,
    change
  );

  const renderReservationBlocks = () => {
    if (error) {
      return <Text>Error fetching reservations</Text>;
    }

    return timeslotDescriptions.map((description, index) => {
      const timeslot = index + 1;
      const reservation = reservations.find(
        (reservation) => reservation.timeslot === timeslot
      );
      let color;

      if (reservation) {
        if (user.priority > reservation.occupier_priority) {
          // My priority is more, overbookable slots
          color = "yellow.100";
        } else {
          // My priority is less or equal, can't change this slot
          color = "gray.600";
        }
      } else {
        // Slot is available
        color = "green.400";
      }

      return (
        <Box display="flex" flexDirection="row" key={timeslot}>
          <Text>{description}</Text>
          <Spacer />
          <Box
            key={timeslot}
            w="20px"
            h="20px"
            background={color}
            padding={2}
            margin={1}
          />
        </Box>
      );
    });
  };

  return (
    <Box marginTop={4}>
      <Text fontWeight="bold">Reservations:</Text>
      <Flex direction="column">{renderReservationBlocks()}</Flex>
    </Box>
  );
};

export default ReservationBlocks;
