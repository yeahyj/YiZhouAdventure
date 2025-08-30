import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
/**
 * 对战房间布局
 */
@ecs.register('DungeonLayoutBattle1Comp')
export class DungeonLayoutBattle1Comp extends ecs.Comp {
    reset(): void {}
}

/**对战房间布局系统 */
export class DungeonLayoutBattle1System extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonLayoutBattle1Comp, RoomModelComp);
    }

    entityEnter(e: ECSEntity): void {}
}
