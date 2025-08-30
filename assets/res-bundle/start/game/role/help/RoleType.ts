import { Vec3 } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { RoleBehaviorStateType } from './RoleEnum';

export type RoleBehaviorStateData =
    | {
          state: RoleBehaviorStateType.Chase;
          data: { chaseEntity: ecs.Entity; chaseRadius?: number; atkRadius?: number };
      }
    | { state: RoleBehaviorStateType.Idle; data: null }
    | { state: RoleBehaviorStateType.Attack; data: { atkEntity: ecs.Entity; dir: Vec3 } }
    | { state: RoleBehaviorStateType.Flee; data: null }
    | { state: RoleBehaviorStateType.Patrol; data: null };
