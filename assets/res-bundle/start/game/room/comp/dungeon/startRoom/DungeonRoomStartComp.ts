import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import BattleUtil from 'db://assets/res-bundle/start/game/common/help/util/BattleUtil';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import { RoomSizeType, RoomType } from 'db://assets/res-bundle/start/game/room/help/RoomEnum';
import { DungeonBaseEnvCommon1Comp } from '../commonRoom/baseEnvironment/DungeonBaseEnvCommon1Comp';

/**
 * 开始房间
 */
@ecs.register('DungeonRoomStartComp')
export class DungeonRoomStartComp extends ecs.Comp {
    onAdd(): void {
        let roomData = BattleUtil.getMapData(RoomSizeType.Normal, RoomType.Start);
        this.ent.add(RoomModelComp).init({ roomData: roomData });
        console.log('开始房间', this.ent.get(RoomModelComp).roomData);
    }

    reset(): void {}
}

/**开始房间系统 */
export class DungeonRoomStartSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonRoomStartComp);
    }

    entityEnter(e: ECSEntity): void {
        e.add(DungeonBaseEnvCommon1Comp);
    }
}
