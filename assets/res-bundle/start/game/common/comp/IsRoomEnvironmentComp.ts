import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 房间环境组件
 */
@ecs.register('IsRoomEnvironmentComp')
export class IsRoomEnvironmentComp extends ecs.Comp {
    reset(): void {}
}
