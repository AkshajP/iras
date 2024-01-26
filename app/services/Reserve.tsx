
import { User } from "./AuthContext";
import supabase from "./client";


export const Reserve = async (
  selectedSlots: number[],
  room_number: string,
  reason: string,
  date: Date,
  user: User|null
) => {
    console.log("getting till reserve.tsx");
  try {
    
    const promises = selectedSlots.map(async (slot) => {
      return supabase
        .from('reservation')
        .insert([
          {
            date: date.toISOString().split('T')[0],
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
  } catch (error:any) {
    return { error: error.message };
  }
};
