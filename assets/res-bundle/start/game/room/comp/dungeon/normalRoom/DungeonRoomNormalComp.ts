import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { CompType } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSModel';
import BattleUtil from 'db://assets/res-bundle/start/game/common/help/util/BattleUtil';
import CommonUtil from 'db://assets/res-bundle/start/game/common/help/util/CommonUtil';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import { RoomSizeType, RoomType } from 'db://assets/res-bundle/start/game/room/help/RoomEnum';
import { DungeonBaseEnvCommon1Comp } from '../commonRoom/baseEnvironment/DungeonBaseEnvCommon1Comp';
import { DungeonLayoutNormal1Comp } from './layout/DungeonLayoutNormal1Comp';
import { DungeonRoleNormal1Comp } from './role/DungeonRoleNormal1Comp';

/**
 * 普通房间
 */
@ecs.register('DungeonRoomNormalComp')
export class DungeonRoomNormalComp extends ecs.Comp {
    /**普通房间基础环境 */
    normalRoomBaseEnv: CompType<ecs.IComp>[] = [DungeonBaseEnvCommon1Comp];
    /**普通房间布局 */
    normalRoomComp: CompType<ecs.IComp>[] = [DungeonLayoutNormal1Comp];
    /**普通房间怪物 */
    normalRoomMonster: CompType<ecs.IComp>[] = [DungeonRoleNormal1Comp];

    onAdd(): void {
        let roomData = BattleUtil.getMapData(RoomSizeType.Normal, RoomType.Normal);
        this.ent.add(RoomModelComp).init({ roomData: roomData });
    }

    reset(): void {}
}

/**普通房间系统 */
export class DungeonRoomNormalSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonRoomNormalComp);
    }

    entityEnter(e: ECSEntity): void {
        const roomComp = e.get(DungeonRoomNormalComp);

        //随机选择一个房间基础环境
        const baseEnv = CommonUtil.randomArraySelect(roomComp.normalRoomBaseEnv);
        if (baseEnv) {
            e.add(baseEnv);
        }

        //随机选择一个房间布局
        const roomLayout = CommonUtil.randomArraySelect(roomComp.normalRoomComp);
        if (roomLayout) {
            e.add(roomLayout);
        }

        //随机选择一个房间怪物
        const monster = CommonUtil.randomArraySelect(roomComp.normalRoomMonster);
        if (monster) {
            e.add(monster);
        }
    }
}
