import { User } from "src/module/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('favourites')
export class Favourite {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User

    @Column()
    tour_id: string
}