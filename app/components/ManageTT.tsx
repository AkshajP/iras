"use client";
import {
  AddIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  Box,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import supabase from "../services/client";
import { useRouter } from "next/navigation";
import FilterableDropdown from "./FilterableDropdown";

type Teacher = {
  id: string;
  name: string;
  contact: string;
  email: string;
  priority: number;
};

type Room = {
  room_number: string;
  class: string;
  floor: number;
  common_area: boolean;
};
export default function ManageTT() {
  const router = useRouter();
  const [timetable, setTimetable] = useState<any[]>([]);
  // timetable is the variable to put changes to. it will cause a re-render
  const [shouldRefetch, setShouldRefetch] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const { data, error } = await supabase.from("timetable").select("*");

        if (error) {
          console.error("Error fetching bookings:", error.message);
        } else {
          setTimetable(data || []);
          setShouldRefetch(false); // Reset the refetch flag
        }
      } catch (error: any) {
        console.error("Error fetching bookings:", error.message);
      }
    };

    if (shouldRefetch) {
      fetchTimetable();
    }
  }, [shouldRefetch]);

  const handleEntryDelete = async (entry: any) => {
    try {
      const { data, error } = await supabase
        .from("timetable")
        .delete()
        .eq("timetable_id", entry.timetable_id);
      if (error) {
        setMessage("Error deleting Timetable entry:" + error);
        setMessageType("error");
      } else {
        setTimetable((timetableEntries: any) =>
          timetableEntries.filter(
            (entry: any) => entry.timetable_id !== entry.timetable_id
          )
        );
        setShouldRefetch(true);
        setMessage("Timetable entry deleted successfully:");
        setMessageType("success");
      }
    } catch (error: any) {
      console.error("Error deleting Timetable entry:", error.message);
      setMessage("Error deleting Timetable entry:" + error.message);
      setMessageType("error");
    }
  };

  const timeslotDescriptions: string[] = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:20 AM - 12:20 PM",
    "12:20 PM - 1:20 PM",
    "1:20 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];
  const dayDescriptions: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const teacherData = async () => {
    try {
      const { data, error } = await supabase.from("teacher").select("*");

      if (error) {
        console.error("Error fetching teachers:", error.message);
        return null;
      } else {
        const teachers: Teacher[] = data.map((teacher: any) => ({
          id: teacher.id,
          name: teacher.name,
          contact: teacher.contact,
          email: teacher.email,
          priority: teacher.priority,
        }));

        return teachers;
      }
    } catch (error: any) {
      console.error("Error fetching teachers:", error.message);
      return null;
    }
  };

  const [teachers, setTeachers] = useState<Teacher[] | null>(null);
  useEffect(() => {
    teacherData().then((teachers) => {
      setTeachers(teachers);
    });
  }, []);

  const roomData = async () => {
    try {
      const { data, error } = await supabase.from("rooms").select("*");

      if (error) {
        console.error("Error fetching teachers:", error.message);
        return null;
      } else {
        const rooms: Room[] = data.map((room: any) => ({
          room_number: room.room_number,
          class: room.class,
          floor: room.floor,
          common_area: room.common_area,
        }));

        return rooms;
      }
    } catch (error: any) {
      console.error("Error fetching teachers:", error.message);
      return null;
    }
  };

  const [classes, setClasses] = useState<Room[] | null>(null);
  useEffect(() => {
    roomData().then((rooms) => {
      setClasses(rooms);
    });
  }, []);

  //MODAL HANDLING
  const { isOpen, onOpen, onClose } = useDisclosure();
  interface Entry {
    timetable_id: number;
    class: string; //foreign key class
    day: number;
    timeslot: number; //foreign key timeslot
    id: string; //foreign key teacher id
  }
  const [entryDetails, setEntryDetails] = useState<Entry | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState<number | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | "warning" | "loading" | undefined
  >();
  useEffect(() => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  }, [message]);

  const handleAdd = async () => {
    if (selectedClass && selectedDay && selectedTimeslot && selectedTeacherId) {
      try {
        const { data, error } = await supabase.from("timetable").insert([
          {
            class: selectedClass,
            day: selectedDay,
            timeslot: selectedTimeslot,
            id: selectedTeacherId,
          },
        ]);

        if (error) {
          setMessage("Error inserting Timetable entry:" + error.message);
          setMessageType("error");
        } else {
          setMessage("Timetable entry inserted successfully");
          setMessageType("success");

          //get the timetable_id of the inserted entry
          const { data, error } = await supabase
            .from("timetable")
            .select("*")
            .eq("class", selectedClass)
            .eq("day", selectedDay)
            .eq("timeslot", selectedTimeslot)
            .eq("id", selectedTeacherId);
          data &&
            setEntryDetails({
              timetable_id: data[0].timetable_id,
              class: data[0].class,
              day: data[0].day,
              timeslot: data[0].timeslot,
              id: data[0].id,
            });
        }
      } catch (error: any) {
        console.error("Error:" + error.message);
        setMessage("Error inserting Timetable entry:" + error.message);
        setMessageType("error");
      }
    }
    onClose();
  };
  useEffect(() => {
    if (entryDetails) setTimetable((prevTT) => [...prevTT, entryDetails]);
    setSelectedClass(null);
    setSelectedDay(null);
    setSelectedTimeslot(null);
    setSelectedTeacherId(null);
  }, [entryDetails]);

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
                Add TimeTable Entry <AddIcon margin={2} />
              </Button>
            </ListItem>
          </List>
        </GridItem>
        <GridItem area="main" marginRight={10} alignContent="space-evenly">
          <>
            <Alert status="warning" margin={10} width="70%">
              <AlertIcon />
              <AlertTitle>
                Each of these timetable entries get set for current day in the
                next week. <br />
                Change only if there is a change in timetable. <br />
                <br />
                Any changes reflect after a week. If needed immidiate change,
                overwrite Timetable reservations.
              </AlertTitle>
            </Alert>
            <TableContainer margin={10}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform="capitalize"
                    >
                      Entry ID
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
                      Day
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
                      Teacher
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
                  {timetable.map((entry) => (
                    <Tr key={entry.timetable_id}>
                      <Td>{entry.timetable_id}</Td>
                      <Td>{entry.class}</Td>
                      <Td>{dayDescriptions[entry.day - 1]}</Td>
                      <Td>{timeslotDescriptions[entry.timeslot - 1]}</Td>
                      <Td>
                        {
                          teachers?.find((teacher) => teacher.id === entry.id)
                            ?.name
                        }
                      </Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleEntryDelete(entry)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* MODAL */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Timetable Entry</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl mb={4}>
                    <FormLabel>Class</FormLabel>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {selectedClass || "Select Class"}
                      </MenuButton>
                      <MenuList
                        style={{
                          overflowY: "scroll",
                          maxHeight: "400px",
                          width: "100%",
                        }}
                      >
                        {classes?.map((room, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => setSelectedClass(room.class)}
                          >
                            {room.class}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Day</FormLabel>
                    {/* Select day from dropdown from values in dayDescriptions */}
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {(selectedDay && dayDescriptions[selectedDay - 1]) ||
                          "Select Day"}
                      </MenuButton>
                      <MenuList>
                        {dayDescriptions.map((day, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => setSelectedDay(index + 1)}
                          >
                            {day}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Timeslot</FormLabel>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {(selectedTimeslot &&
                          timeslotDescriptions[selectedTimeslot - 1]) ||
                          "Select Timeslot"}
                      </MenuButton>
                      <MenuList>
                        {timeslotDescriptions.map((timeslot, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => setSelectedTimeslot(index + 1)}
                          >
                            {timeslot}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Teacher</FormLabel>
                    {/* // Select teacher from dropdown */}
                    <FilterableDropdown
                      options={(teachers || []).map((teacher) => teacher.name)}
                      onSelect={(selectedTeacherName: string) => {
                        const selectedTeacher = teachers?.find(
                          (teacher) => teacher.name === selectedTeacherName
                        );

                        setSelectedTeacherId(selectedTeacher?.id || "");
                      }}
                    ></FilterableDropdown>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleAdd}>
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
