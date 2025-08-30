import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
/**
 * 禁止移动组件
 */
@ecs.register('LockMoveComp')
export class LockMoveComp extends ecs.Comp {
    reset(): void {}
}
