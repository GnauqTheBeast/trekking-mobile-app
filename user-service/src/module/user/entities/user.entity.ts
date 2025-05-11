import { Role } from 'src/module/role/entities/role.entity';
import {Entity, Column, PrimaryGeneratedColumn, Index, Timestamp, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn} from 'typeorm'

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 15, nullable: true })
    phone_number: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'date', nullable: true })
    dob: Date;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true })
    updatedAt: Date;

    @OneToOne(() => Role, {cascade: true})
    @JoinColumn({name: 'role_id'})
    role: Role
}