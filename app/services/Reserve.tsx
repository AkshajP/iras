import supabase from "./client";

export const Reserve = async (
  selectedSlots: number[],
  room_number: string,
  reason: string,
  date: Date,
  user: any
) => {
  try {
    const promises = selectedSlots.map(async (slot) => {
      const existingReservation = await supabase
        .from("reservation")
        .select("*")
        .eq("room_no", room_number)
        .eq("date", date.toISOString().split("T")[0])
        .eq("timeslot", slot);

      if (
        existingReservation.data?.length &&
        existingReservation.data?.length > 0
      ) {
        await supabase
          .from("reservation")
          .delete()
          .eq("room_no", room_number)
          .eq("date", date.toISOString().split("T")[0])
          .eq("timeslot", slot);
      }

      // Add the new reservation
      return supabase
        .from("reservation")
        .insert([
          {
            date: date.toISOString().split("T")[0],
            room_no: room_number,
            reason: reason,
            occupier_id: user?.id,
            occupier_priority: user?.priority,
            timeslot: slot,
          },
        ])
        .select();
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error: any) {
    return { error: error.message };
  }
};
