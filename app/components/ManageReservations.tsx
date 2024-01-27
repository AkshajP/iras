"use client";
import React, { useState, useEffect } from "react";
import supabase from "../services/client";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

const ManageBookings = () => {
  const router = useRouter();
  const user = JSON.parse(
    (typeof window !== "undefined" && localStorage.getItem("userData")) || "{}"
  );

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user]);

  const [bookings, setBookings] = useState<any>([]);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }, [message]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("reservation")
          .select("*")
          .eq("occupier_id", user?.id);

        if (error) {
          console.error("Error fetching bookings:", error.message);
        } else {
          setBookings(data || []);
        }
      } catch (error: any) {
        console.error("Error fetching bookings:", error.message);
      }
    };

    fetchBookings();
  }, [user]);

  const handleDeleteBooking = async (bookingId: any) => {
    setDeleting(true);
    try {
      await supabase.from("reservation").delete().eq("rid", bookingId);

      // Update state after successful deletion
      setBookings((prevBookings: any) =>
        prevBookings.filter((booking: any) => booking.rid !== bookingId)
      );
      setDeleting(false);
      setMessage("Booking deleted successfully");
    } catch (error: any) {
      console.error("Error deleting booking:", error.message);
      setDeleting(false);
    }
  };

  return (
    <>
      {message && (
        <Alert
          status="success"
          style={{
            position: "fixed",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "400px",
            borderRadius: "10px",
            backgroundColor: "#48BB78",
          }}
        >
          <AlertIcon />
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      )}
      <Box p="4">
        <h2>Your Bookings</h2>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Reservation ID</Th>
              <Th>Date</Th>
              <Th>Room Number</Th>
              <Th>Timeslot</Th>
              <Th>Reason</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking: any) => (
              <Tr key={booking.rid}>
                <Td>{booking.rid}</Td>
                <Td>{booking.date}</Td>
                <Td>{booking.room_no}</Td>
                <Td>{booking.timeslot}</Td>
                <Td>{booking.reason}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteBooking(booking.rid)}
                  >
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default ManageBookings;
