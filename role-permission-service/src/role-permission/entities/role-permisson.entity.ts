import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Permission } from './permission.entity';

@Entity('role_permission')
export class RolePermission {
  @PrimaryColumn('uuid')
  role_id: string;

  @PrimaryColumn('uuid')
  permission_id: string;

  @ManyToOne(() => Permission, permission => permission.rolePermission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
