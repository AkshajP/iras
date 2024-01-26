import { Button, List, ListItem, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export interface Floor {
  floor: number | null;
  text: string;
}

interface FloorListProps {
  onSelectFloor: (floor: Floor) => void;
  selectedFloor: Floor | null;
}

const FloorList: React.FC<FloorListProps> = ({
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
  // const floors: Floor[] = Object.entries(floorMapping).map(([floor, text]) => ({
  //   floor: parseInt(floor, 10),
  //   text,
  // }));
  const router = useRouter();
  const user = JSON.parse(typeof window !== "undefined" && localStorage.getItem("userData") || "{}");

  const floors: Floor[] = [
    { floor: null, text: "All Floors" },
    ...Object.entries(floorMapping).map(([floor, text]) => ({
      floor: parseInt(floor, 10),
      text,
    })),
  ];

  return (
    <>
      <List>
        <Text fontSize="large">
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
    </>
  );
};

export default FloorList;
