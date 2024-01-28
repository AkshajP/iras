import rvlogo from "../assets/rvlogo.png";
import Image from "next/image";
import {
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import supabase from "../services/client";

interface Teacher {
  id: number;
  name: string;
}

interface Reservation {
  id: number;
  date: string;
  room_no: string;
  reason: string;
  occupier_id: number;
  timeslot: number;
}

const NavBar: React.FC = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const user = JSON.parse(
    (typeof window !== "undefined" && localStorage.getItem("userData")) || "{}"
  );

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from("teacher")
          .select("id, name");

        if (error) {
          console.error("Error fetching teachers:", error.message);
        } else {
          setTeachers(data || []);
        }
      } catch (error: any) {
        console.error("Error fetching teachers:", error.message);
      }
    };

    fetchTeachers();
  }, []);

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
    const fetchReservations = async () => {
      try {
        console.log(selectedTeacherId);
        const { data, error } = await supabase
          .from("reservation")
          .select("*")
          .eq("occupier_id", selectedTeacherId)
          .eq("date", formattedDate()[0]);

        if (error) {
          console.error("Error fetching reservations:", error.message);
        } else {
          setReservations(data || []);
          console.log(data);
        }
      } catch (error: any) {
        console.error("Error fetching reservations:", error.message);
      }
    };

    if (selectedTeacherId !== null) {
      fetchReservations();
    }
  }, [selectedTeacherId]);

  const handleLogout = async () => {
    setLoading(true);
    if (typeof window !== "undefined") localStorage.clear();
    const { error } = await supabase.auth.signOut();
    router.push("/auth/login");
    setLoading(false);
  };

  const handleTeacherSelect = (teacherId: number) => {
    setSelectedTeacherId(teacherId);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedTeacherId(null);
    onClose();
  };

  const timeslotDescription: string[] = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:20 AM - 12:20 PM",
    "12:20 PM - 1:20 PM",
    "1:20 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
  ];

  return (
    <HStack justifyContent="space-between" padding="10px">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src={rvlogo} width={60} alt="logo" height={60} />
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Find Teacher By Reservation
          </MenuButton>
          <MenuList
            style={{ overflowY: "scroll", maxHeight: "500px", width: "100%" }}
          >
            {teachers.map((teacher) => (
              <MenuItem
                key={teacher.id}
                onClick={() => handleTeacherSelect(teacher.id)}
              >
                {teacher.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Button
          onClick={() => {
            if (user.priority == 1) router.push("student/manage");
            else if (user.priority == 2) router.push("teacher/manage");
            else if (user.priority == 3)
              router.push("admin/manage/reservations");
          }}
        >
          My reservations
        </Button>
      </div>
      <HStack>
        <Text>Hello {user.name}</Text>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={handleLogout}
          isLoading={loading}
          loadingText="Logging Out"
        >
          Log Out
        </Button>
      </HStack>
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Teacher Details For Today</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTeacherId !== null && reservations.length > 0 ? (
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
                      Reason
                    </Th>
                    <Th
                      fontWeight="bold"
                      fontSize="lg"
                      textTransform="capitalize"
                    >
                      Time
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {reservations.map((reservation) => (
                    <Tr key={reservation.id}>
                      <Td>{reservation.room_no}</Td>
                      <Td>{reservation.reason}</Td>
                      <Td>{timeslotDescription[reservation.timeslot - 1]}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <p>No reservations found for the selected teacher.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

export default NavBar;
