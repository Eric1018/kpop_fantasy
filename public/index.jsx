import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const useDataSource = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("kpop_fantasy")
        .select("id, name, photo, group, debutyear, position, mbti, price")
        .order("price", { ascending: false })
        .order("group", { ascending: true });

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        console.log("Fetched data:", data);

        // Format data by adding a unique key
        const formattedData = data.map((item, index) => ({
          key: String(index + 1),
          ...item,
        }));

        setDataSource(formattedData);
      }
    };

    fetchData();
  }, []);

  return dataSource;
};
