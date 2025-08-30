import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
/**
 * 禁止施法组件
 */
@ecs.register('LockStaffCastComp')
export class LockStaffCastComp extends ecs.Comp {
    reset(): void {}
}
