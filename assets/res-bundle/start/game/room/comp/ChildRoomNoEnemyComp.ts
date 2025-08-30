import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { StateRoomNoEnemyComp } from './StateRoomNoEnemyComp';

/**
 * 房间干净条件组件
 * 普通房间消灭所有敌人
 */
@ecs.register('ChildRoomNoEnemyComp')
export class ChildRoomNoEnemyComp extends ecs.Comp {
    reset(): void {}
}

/**
 * 普通房间干净条件系统
 * 消灭所有敌人
 */
export class ChildRoomNoEnemySystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(ChildRoomNoEnemyComp, StateRoomNoEnemyComp);
    }

    entityEnter(entity: ECSEntity): void {
        for (let child of entity.children.values()) {
            if (!child.has(StateRoomNoEnemyComp)) {
                child.add(StateRoomNoEnemyComp);
            }
        }
    }
    entityRemove(entity: ECSEntity): void {
        for (let child of entity.children.values()) {
            if (child.has(StateRoomNoEnemyComp)) {
                child.remove(StateRoomNoEnemyComp);
            }
        }
    }
}
