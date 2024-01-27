import { AddIcon, ChevronLeftIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Grid,
  GridItem,
  List,
  ListItem,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  TableContainer,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AddRoom from "./AddRoom"; // Adjust the import path based on your project structure
import supabase from "../services/client";
import UseRoom, { RoomClass } from "../hooks/useRoom";

function ManageRooms() {
  const [isAddRoomModalOpen, setAddRoomModalOpen] = useState(false);
  const { rooms, error } = UseRoom(null);
  const [finalRooms, setFinalRooms] = useState<RoomClass[]>([]);

  useEffect(() => {
    // Set the rooms after the component mounts
    if (JSON.stringify(finalRooms) !== JSON.stringify(rooms)) {
      setFinalRooms(rooms);
    }
  }, [finalRooms, rooms]);

  const handleOpenAddRoomModal = () => {
    setAddRoomModalOpen(true);
  };

  const handleCloseAddRoomModal = () => {
    setAddRoomModalOpen(false);
  };

  const handleAddRoom = async (roomDetails: RoomClass) => {
    try {
      // Insert the room details into the 'rooms' table
      const { data, error } = await supabase
        .from("rooms")
        .upsert([roomDetails]);

      if (error) {
        console.error("Error inserting room:", error);
        // Handle error state if needed
      } else {
        console.log("Room inserted successfully:", roomDetails);
        setFinalRooms((prevRooms) => [...prevRooms, roomDetails]);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
    handleCloseAddRoomModal();
  };

  const handleDeleteRoom = async (selectedRoom: string) => {
    try {
      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("room_number", selectedRoom);
      if (error) {
        console.error("Error deleting room:", error);
      } else {
        setFinalRooms((prevRooms) =>
          prevRooms.filter((room) => room.room_number !== selectedRoom)
        );
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav nav" "main main"`,
          lg: `"nav nav" "main main"`,
        }}
      >
        <GridItem area="nav" margin={10}>
          <List display="flex" flexDirection="row">
            <ListItem marginRight={5}>
              <Button>
                <ChevronLeftIcon />
                Back
              </Button>
            </ListItem>
            <ListItem marginRight={5}>
              <Button onClick={handleOpenAddRoomModal}>
                Add Room <AddIcon margin={2} />
              </Button>
            </ListItem>
          </List>
        </GridItem>
        <GridItem area="main" marginRight={10} alignContent="space-evenly">
          <>
            <Alert status="warning" margin={10} width="70%">
              <AlertIcon />
              <AlertTitle>
                Each of these rooms are referenced by other tables. Do not
                delete a room without knowledge. <br />
                (For this project's purpose L991-L999 will be rooms having no
                relation which can be deleted)
              </AlertTitle>
            </Alert>
            <TableContainer margin={10}>
              <Table variant="simple">
                <TableCaption>Rooms Information</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Room Number</Th>
                    <Th>Class</Th>
                    <Th>Floor</Th>
                    <Th>Common Area</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {finalRooms.map((room) => (
                    <Tr key={room.room_number}>
                      <Td>{room.room_number}</Td>
                      <Td>{room.class}</Td>
                      <Td>{room.floor}</Td>
                      <Td>{room.common_area ? "Yes" : "No"}</Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => {
                            console.log("Delete presed: Not deleting room");
                            handleDeleteRoom(room.room_number);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        </GridItem>
      </Grid>

      <AddRoom
        isOpen={isAddRoomModalOpen}
        onClose={handleCloseAddRoomModal}
        onAddRoom={handleAddRoom}
      />
    </>
  );
}

export default ManageRooms;
