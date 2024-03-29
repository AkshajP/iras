import {
  AddIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Grid,
  GridItem,
  List,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import supabase from "../services/client";
import { useRouter } from "next/navigation";

export default function ManageRooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase.from("rooms").select("*");

        if (error) {
          console.error("Error fetching bookings:", error.message);
        } else {
          setRooms(data || []);
          setShouldRefetch(false); // Reset the refetch flag
        }
      } catch (error: any) {
        console.error("Error fetching bookings:", error.message);
      }
    };

    if (shouldRefetch) {
      fetchRooms();
    }
  }, [shouldRefetch]);

  const handleRoomDelete = async (roomDetails: any) => {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .delete()
        .eq("room_number", roomDetails.room_number);
      if (error) {
        setMessage("Room deletion error :" + error);
        setMessageType("error");
      } else {
        setRooms((prevRooms: any) =>
          prevRooms.filter(
            (room: any) => room.room_number !== roomDetails.room_number
          )
        );
        setShouldRefetch(true);
        setMessage("Booking deleted successfully");
        setMessageType("success");
      }
    } catch (error: any) {
      console.error("Error deleting booking:", error.message);
      setMessage("Room deletion error :" + error.message);
      setMessageType("error");
    }
  };

  //MODAL HANDLING
  const { isOpen, onOpen, onClose } = useDisclosure();
  interface room {
    room_number: string;
    class: string;
    floor: number;
    common_area: boolean;
    type: number;
  }
  const types = ["Classroom", "Lab", "Common Area"];
  const [selectedType, setSelectedType] = useState<number>(0);

  const [roomDetails, setRoomDetails] = useState<room | null>(null);

  const handleAdd = async (roomDetails: any, selectedType: number) => {
    try {
      const { data, error } = await supabase.from("rooms").insert([
        {
          ...roomDetails,
          type: selectedType,
        },
      ]);

      if (error) {
        setMessage("Error inserting room:" + error.message);
        setMessageType("error");
      } else {
        setMessage("Room inserted successfully");
        setMessageType("success");
        setShouldRefetch(true);
      }
    } catch (error: any) {
      console.error("Error:" + error.message);
      setMessage("Room deletion error :" + error);
      setMessageType("error");
    }
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setRoomDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]:
        name === "floor"
          ? parseInt(value, 10) // Parse as integer or default to 0
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | "warning" | "loading" | undefined
  >();
  //ALERT HANDLING
  const [message, setMessage] = useState("");
  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }, [message]);

  return (
    <>
      {message && (
        <Alert
          status={messageType}
          style={{
            position: "fixed",
            top: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "400px",
            borderRadius: "10px",
            backgroundColor: messageType === "success" ? "#48BB78" : "#9B2C2C", // CHANGE THIS
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
        <GridItem area="nav" margin={10}>
          <List display="flex" flexDirection="row">
            <ListItem marginRight={5}>
              <Button onClick={() => router.push("/admin")}>
                <ChevronLeftIcon />
                Back
              </Button>
            </ListItem>
            <ListItem marginRight={5}>
              <Button onClick={onOpen}>
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
                For this project&apos;s purpose L991-L999 will be rooms having
                no relation which can be deleted
              </AlertTitle>
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
                      Room Number
                    </Th>
                    <Th
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform="capitalize"
                    >
                      Class
                    </Th>
                    <Th
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform="capitalize"
                    >
                      Floor
                    </Th>
                    <Th
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform="capitalize"
                    >
                      Common Area
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
                  {rooms.map((room) => (
                    <Tr key={room.room_number}>
                      <Td>{room.room_number}</Td>
                      <Td>{room.class}</Td>
                      <Td>{room.floor}</Td>
                      <Td>{types[room.type - 1]}</Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRoomDelete(room)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Room Entry</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl mb={4}>
                    <FormLabel>Room Number</FormLabel>
                    <Input
                      required
                      type="text"
                      name="room_number"
                      value={roomDetails?.room_number}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Class</FormLabel>
                    <Input
                      required
                      type="text"
                      name="class"
                      value={roomDetails?.class}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Floor</FormLabel>
                    <Input
                      required
                      type="number"
                      name="floor"
                      value={roomDetails?.floor}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Type</FormLabel>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {selectedType ? types[selectedType - 1] : "Select Type"}
                        {/* {selectedClass || "Select Class"} */}
                      </MenuButton>
                      <MenuList
                        style={{
                          overflowY: "scroll",
                          maxHeight: "400px",
                          width: "100%",
                        }}
                      >
                        {types?.map((room, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => {
                              setSelectedType(index + 1);
                            }}
                          >
                            {types[index]}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    isDisabled={!(roomDetails && selectedType)}
                    onClick={() => handleAdd(roomDetails, selectedType)}
                  >
                    Add
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        </GridItem>
      </Grid>
    </>
  );
}
