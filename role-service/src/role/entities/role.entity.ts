import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

}
