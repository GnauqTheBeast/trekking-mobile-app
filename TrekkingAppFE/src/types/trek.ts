import { BatchProps } from "./batch";
import { HostProps } from "./host";

export interface TrekProps {
  id: string;
  name: string;
  location: string;
  duration: string;
  rate?: number;
  booked?: number;
  price: number;
  distance?: number;
  elevation?: number;
  level: string;
  image: string[];
  description?: string;
  host: HostProps;
  available_batches: BatchProps[];
}
