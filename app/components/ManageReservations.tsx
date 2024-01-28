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
  Grid,
  GridItem,
  List,
  ListItem,
  TableContainer,
} from "@chakra-ui/react";
import { ChevronLeftIcon, DeleteIcon } from "@chakra-ui/icons";
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

  const currentDate = new Date();
  const formattedDate = () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return [formattedDate, formattedTime];
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("reservation")
          .select("*")
          .eq("occupier_id", user?.id)
          .gte("date", formattedDate()[0]);

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

      <Grid
        templateAreas={{
          base: `"nav nav" "main main"`,
          lg: `"nav nav" "main main"`,
        }}
      >
        <GridItem area="nav" marginTop={10} marginLeft={10}>
          <List display="flex" flexDirection="row">
            <ListItem marginRight={5}>
              <Button
                onClick={() => {
                  if (user.priority == 3) {
                    router.push("/admin");
                  } else if (user.priority == 2) {
                    router.push("/teacher");
                  } else if (user.priority == 1) {
                    router.push("/student");
                  }
                }}
              >
                <ChevronLeftIcon />
                Back
              </Button>
            </ListItem>
          </List>
        </GridItem>
        <GridItem area="main" marginRight={10} alignContent="space-evenly">
          <Alert status="info" maxWidth="90%" margin={10}>
            <AlertIcon />
            Your Reservations from today onwards are displayed here
          </Alert>
          <TableContainer margin={10} maxWidth="90%">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th
                    fontWeight="bold"
                    fontSize="lg"
                    textTransform="capitalize"
                  >
                    Reservation ID
                  </Th>
                  <Th
                    fontWeight="bold"
                    fontSize="lg"
                    textTransform="capitalize"
                  >
                    Date
                  </Th>
                  <Th
                    fontWeight="bold"
                    fontSize="lg"
                    textTransform="capitalize"
                  >
                    Room Number
                  </Th>
                  <Th
                    fontWeight="bold"
                    fontSize="lg"
                    textTransform="capitalize"
                  >
                    Timeslot
                  </Th>
                  <Th
                    fontWeight="bold"
                    fontSize="lg"
                    textTransform="capitalize"
                  >
                    Reason
                  </Th>
                  <Th
                    fontWeight="bold"
                    fontSize="lg"
                    textTransform="capitalize"
                  >
                    Action
                  </Th>
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
          </TableContainer>
        </GridItem>
      </Grid>
    </>
  );
};

export default ManageBookings;
