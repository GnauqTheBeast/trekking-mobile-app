import { PaymentProps } from "./payment";
import { TrekHostProps, TrekProps } from "./trek";

export interface BookingProps {
    id?: string;
    porter_id: string;
    trek: Omit<TrekHostProps, 'description' | 'status' | 'rate'>;
    payment?: PaymentProps;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    total_person: number;
    total_amount: number;
    created_at: string;
}