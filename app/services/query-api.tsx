import supabase from "./client";
import {useEffect,useState} from "react";

function queryApi(tablename:string) {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<any>(null);

    const fetchData = async () => {
    try {
      const { data, error } = await supabase.from(tablename).select('*');
      if (data) {
        setData(data || []);
      }
      if (error) {
        setError(error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };

    useEffect(() => {
        fetchData();
    }, [tablename]);
    return { data, error };
}

export default queryApi