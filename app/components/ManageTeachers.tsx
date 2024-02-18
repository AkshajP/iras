import { AddIcon, ChevronLeftIcon, DeleteIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import supabase from "../services/client";
import { useRouter } from "next/navigation";
function ManageTeachers() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<any[]>([]);

  const [shouldRefetch, setShouldRefetch] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const { data, error } = await supabase.from("teacher").select("*");

        if (error) {
          console.error("Error fetching bookings:", error.message);
        } else {
          setTeachers(data || []);
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

  // const handleTeacherDelete = async (teacherDetails: any) => {
  //   console.log("Teacher to be deleted:", teacherDetails);
  //   try {
  //     const { data, error } = await supabase
  //       .from("teacher")
  //       .delete()
  //       .eq("id", teacherDetails.id);
  //     if (error) {
  //       setMessage("Error deleting Teacher:");
  //       setMessageType("error");
  //     } else {
  //       setTeachers((prevRooms: any) =>
  //         prevRooms.filter((teacher: any) => teacher.id !== teacherDetails.id)
  //       );
  //       //setDeleting(false);
  //       setMessage("Teacher deleted successfully.");
  //       setMessageType("success");
  //       setShouldRefetch(true);
  //     }
  //   } catch (error: any) {
  //     console.error("Error deleting Teacher:", error.message);
  //     //setDeleting(false);
  //   }
  // };

  //MODAL HANDLING
  const { isOpen, onOpen, onClose } = useDisclosure();
  interface teacher {
    id: string;
    name: string;
    contact: string;
    email: string;
    priority: number;
  }
  const [teacherDetails, setTeacherDetails] = useState<teacher | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setTeacherDetails((prevDetails: any) => {
      // Ensure the values are appropriately parsed or handled based on the input type
      const updatedValue =
        type === "number"
          ? parseInt(value, 10)
          : type === "checkbox"
            ? checked
            : value;

      return {
        ...prevDetails,
        [name]: updatedValue,
      };
    });
  };

  const handleAdd = async (teacherDetails: teacher | null) => {
    try {
      const { data, error } = await supabase
        .from("teacher")
        .upsert([teacherDetails]);
      if (error) {
        setMessage("Error adding teacher:" + error.message);
        console.log(error);
        setMessageType("error");
      } else {
        setMessage("Teacher added successfully:");
        setMessageType("success");
        setTeachers((prevTeachers) => [...prevTeachers, teacherDetails]);
        setShouldRefetch(true);
      }
    } catch (error: any) {
      console.error("Error:" + error.message);
    }
    onClose();
  };
  const [idUniqueStatus, setIdUniqueStatus] = useState<boolean>(false);
  const [emailUniqueStatus, setEmailUniqueStatus] = useState<boolean>(false);

  //ALERT HANDLING
  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | "warning" | "loading" | undefined
  >();
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
                Add Teacher <AddIcon margin={2} />
              </Button>
            </ListItem>
          </List>
        </GridItem>
        <GridItem area="main" marginRight={10} alignContent="space-evenly">
          <>
            <Alert status="warning" margin={10} width="70%">
              <AlertIcon />
              <AlertTitle>
                These teachers will be referenced by other tables. <br />
                No teacher can be deleted once entered to maintain data the
                integrity and auditability of the system.
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
                      Teacher ID
                    </Th>
                    <Th
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform="capitalize"
                    >
                      Name
                    </Th>
                    <Th
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform="capitalize"
                    >
                      Contact
                    </Th>
                    <Th
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform="capitalize"
                    >
                      Email
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {teachers.map((teacher) => (
                    <Tr key={teacher.id}>
                      <Td>{teacher.id}</Td>
                      <Td>{teacher.name}</Td>
                      <Td>{teacher.contact}</Td>
                      <Td>{teacher.email}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Teacher</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl mb={4}>
                    <FormLabel>Unique ID</FormLabel>
                    <Input
                      required
                      type="text"
                      name="id"
                      isInvalid={!idUniqueStatus}
                      value={teacherDetails?.id}
                      onChange={(event) => {
                        handleInputChange(event);

                        const currentId = event.target.value;
                        const teacherExists = teachers.find(
                          (teacher) => teacher.id === currentId
                        );

                        if (teacherExists) {
                          // Set the option to invalid status
                          setIdUniqueStatus(false);
                        } else {
                          // Set the option to valid status
                          setIdUniqueStatus(true);
                        }
                      }}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      required
                      type="text"
                      name="name"
                      value={teacherDetails?.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Contact</FormLabel>
                    <Input
                      required
                      type="number"
                      name="contact"
                      value={teacherDetails?.contact}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      required
                      isInvalid={!emailUniqueStatus} //email unique false => invalid true
                      type="email"
                      name="email"
                      value={teacherDetails?.email}
                      onChange={(event) => {
                        handleInputChange(event);

                        const currentEmail = event.target.value;
                        const teacherExists = teachers.find(
                          (teacher) => teacher.email === currentEmail
                        );

                        if (teacherExists) {
                          // Set the option to invalid status
                          setEmailUniqueStatus(false);
                        } else {
                          // Set the option to valid status
                          setEmailUniqueStatus(true);
                        }
                      }}
                    />
                  </FormControl>
                  {!(idUniqueStatus && emailUniqueStatus) ? (
                    <p>
                      Red outlined fields are invalid. Please correct them
                      before adding.
                    </p>
                  ) : (
                    <></>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    isDisabled={!(idUniqueStatus && emailUniqueStatus)}
                    onClick={() => {
                      handleAdd(teacherDetails);
                    }}
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

export default ManageTeachers;
