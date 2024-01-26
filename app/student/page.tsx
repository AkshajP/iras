"use client";
import { Box, Grid, GridItem, Show, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TypeSelector from "../components/TypeSelector";
import FloorList, { Floor } from "../components/FloorList";
import GameGrid from "../components/GameGrid";
import NavBar from "../components/NavBar";
import DateSelector from "../components/DateSelector";
import { useRouter } from "next/navigation";

const Page = () => {
  const user = JSON.parse(
    (typeof window !== "undefined" && localStorage.getItem("userData")) || "{}"
  );
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedType, setSelectedType] = useState<"all" | "ca" | "classroom">(
    "all"
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(
        (typeof window !== "undefined" && localStorage.getItem("userData")) ||
          "{}"
      );

      if (user.priority != 1 && typeof window !== "undefined") {
        localStorage.clear();
        router.push("/");
      }
    }
  });

  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav nav" "main main"`,
          lg: `"nav nav nav nav" "aside main main main "`,
        }}
      >
        <GridItem area="nav">
          <NavBar />
        </GridItem>
        <Show above="lg">
          <GridItem area="aside" marginRight={10}>
            <FloorList
              selectedFloor={selectedFloor}
              onSelectFloor={(floor: Floor) => setSelectedFloor(floor)}
            />
          </GridItem>
        </Show>
        <GridItem area="main" marginRight={10} alignContent="space-evenly">
          <Stack spacing={4} direction="row">
            <TypeSelector
              onSelectType={(selectedType: "all" | "ca" | "classroom") =>
                setSelectedType(selectedType)
              }
            />
            <DateSelector
              onSelectDate={(selectedDate: Date) =>
                setSelectedDate(selectedDate)
              }
            />
          </Stack>
          <Box padding={2} />
          <GameGrid
            user={user}
            selectedDate={selectedDate}
            selectedFloor={selectedFloor}
            selectedType={selectedType}
          />
        </GridItem>
      </Grid>
    </>
  );
};

export default Page;
