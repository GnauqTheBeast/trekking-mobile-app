import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from 'src/module/role/entities/role.entity';

@Entity('role_permission')
export class RolePermission {
  @PrimaryColumn('uuid')
  role_id: string;

  @PrimaryColumn('uuid')
  permission_id: string;

  @ManyToOne(() => Permission, permission => permission.rolePermission)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @ManyToOne(() => Role, role => role.rolePermissions)
  @JoinColumn({name: 'role_id'})
  role: Role
}
