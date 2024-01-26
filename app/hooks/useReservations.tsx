import supabase from "../services/client";
import { useEffect, useState } from "react";

export interface Reservation {
  rid: number;
  date: Date;
  room_no: string;
  reason: string;
  occupier_id: string;
  occupier_priority: string;
  timeslot: number;
}

const useReservations = (selectedDate: Date, room_number: string) => {
  const fetchReservationData = FetchReservations(selectedDate, room_number);
  const reservations = fetchReservationData.data.map((reservationData) => {
    const {
      rid,
      date,
      room_no,
      reason,
      occupier_id,
      occupier_priority,
      timeslot,
    } = reservationData;
    const reservation: Reservation = {
      rid,
      date: new Date(date),
      room_no,
      reason,
      occupier_id,
      occupier_priority,
      timeslot,
    };
    return reservation;
  });
  const error = fetchReservationData.error;

  return { Reservation: reservations, error };
};

export default useReservations;

function FetchReservations(selectedDate: Date, room_number: string) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  const formattedDate = selectedDate.toISOString().split("T")[0];

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("reservation")
        .select("*")
        .eq("date", formattedDate)
        .eq("room_no", room_number);
      if (data) {
        setData(data || []);
      }
      if (error) {
        setError(error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  return { data, error };
}
