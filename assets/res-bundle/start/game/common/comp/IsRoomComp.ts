import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 房间组件
 */
@ecs.register('IsRoomComp')
export class IsRoomComp extends ecs.Comp {
    reset(): void {}
}
