export interface TrekProps {
  id: string;
  name: string;
  location: string;
  duration: string;
  rate?: number;
  price: number;
  distance?: number;
  elevation?: number;
  level: string;
  images: string[];
  description?: string;
  startAt: string;
  endAt: string;
  total_slot: number;
  available_slot: number;
  host_id: string;
}

export interface Host {
  id: string,
  name: string,
  image: string | null
}

export interface TrekHostProps {
  id: string;
  name: string;
  description: string;
  host: Host;
  total_slot: number;
  available_slot: number;
  status: string;
  startAt: string;
  endAt: string;
  price: number;
  duration: string;
  distance: number;
  elevation: number;
  location: string;
  images: string[];
  rate: number;
  level: string;
  createdAt: string;
  updatedAt: string;
}
