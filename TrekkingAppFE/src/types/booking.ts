import { BatchProps } from "./batch";
import { PaymentProps } from "./payment";
import { TrekProps } from "./trek";

export interface BookingProps {
    id: string;
    trek: TrekProps;
    batch: BatchProps;
    payment?: PaymentProps;
    status: string;
    total_person: number;
    total_amount: number;
    book_at?: string;
}