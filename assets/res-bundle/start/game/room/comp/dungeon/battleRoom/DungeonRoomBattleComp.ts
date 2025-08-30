import { DungeonRoleBattle1Comp } from './role/DungeonRoleBattle1Comp';
import { DungeonBaseEnvCommon1Comp } from '../commonRoom/baseEnvironment/DungeonBaseEnvCommon1Comp';
import CommonUtil from 'db://assets/res-bundle/start/game/common/help/util/CommonUtil';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { CompType } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSModel';
import BattleUtil from 'db://assets/res-bundle/start/game/common/help/util/BattleUtil';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import { RoomSizeType, RoomType } from 'db://assets/res-bundle/start/game/room/help/RoomEnum';

/**
 * 对战房间
 */
@ecs.register('DungeonRoomBattleComp')
export class DungeonRoomBattleComp extends ecs.Comp {
    /**对战房间基础环境 */
    battleRoomBaseEnv: CompType<ecs.IComp>[] = [DungeonBaseEnvCommon1Comp];
    /**对战房间布局 */
    battleRoomComp: CompType<ecs.IComp>[] = [];
    /**对战房间怪物 */
    battleRoomMonster: CompType<ecs.IComp>[] = [DungeonRoleBattle1Comp];

    onAdd(): void {
        let roomData = BattleUtil.getMapData(RoomSizeType.Normal, RoomType.Battle);
        this.ent.add(RoomModelComp).init({ roomData: roomData });
    }

    reset(): void {}
}

/**对战房间系统 */
export class DungeonRoomBattleSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonRoomBattleComp);
    }

    entityEnter(e: ECSEntity): void {
        const roomComp = e.get(DungeonRoomBattleComp);

        //随机选择一个房间基础环境
        const baseEnv = CommonUtil.randomArraySelect(roomComp.battleRoomBaseEnv);
        if (baseEnv) {
            e.add(baseEnv);
        }

        //随机选择一个房间布局
        const roomLayout = CommonUtil.randomArraySelect(roomComp.battleRoomComp);
        if (roomLayout) {
            e.add(roomLayout);
        }

        //随机选择一个房间怪物
        const monster = CommonUtil.randomArraySelect(roomComp.battleRoomMonster);
        if (monster) {
            e.add(monster);
        }
    }
}
