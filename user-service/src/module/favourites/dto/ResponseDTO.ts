export interface Host {
    id: string,
    name: string,
    image: string | null
}

export interface FavoriteProps {
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
    rate: string;
    level: string;
    createdAt: string;
    updatedAt: string;
}

export interface ResponseDTO<T> {
    status: number,
    message: string,
    data: T | null
}