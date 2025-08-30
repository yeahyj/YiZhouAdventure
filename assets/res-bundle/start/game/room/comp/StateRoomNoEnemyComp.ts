import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 房间没有敌人状态组件
 */
@ecs.register('StateRoomNoEnemyComp')
export class StateRoomNoEnemyComp extends ecs.Comp {
    reset(): void {}
}
