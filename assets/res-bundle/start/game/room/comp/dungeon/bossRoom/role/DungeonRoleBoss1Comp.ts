import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { FactionType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import BattleUtil from 'db://assets/res-bundle/start/game/common/help/util/BattleUtil';
import { DungeonRoleId } from 'db://assets/res-bundle/start/game/role/help/RoleEnum';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import { RoomEntity } from 'db://assets/res-bundle/start/game/room/entity/RoomEntity';
import { IRoomRole } from 'db://assets/res-bundle/start/game/room/help/RoomInterface';

/**
 * boss房间,生成一个boss
 */
@ecs.register('DungeonMonsterBoss1Comp')
export class DungeonRoleBoss1Comp extends ecs.Comp {
    reset(): void {}
}

/**boss房间系统 */
export class DungeonRoleBoss1System extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonRoleBoss1Comp, RoomModelComp);
    }

    entityEnter(e: RoomEntity): void {
        this.randomGenerateRole(e);
        e.remove(DungeonRoleBoss1Comp);
    }

    /**随机生成怪物 */
    private randomGenerateRole(e: RoomEntity) {
        let roomData = e.get(RoomModelComp).roomData;
        let monsterData: IRoomRole[] = [];
        let monsterId = DungeonRoleId.DUNGEON_FLY_BOSS;
        let monsterPosIndex = BattleUtil.randomMoveTiledIndex(e);
        let monsterPos = BattleUtil.getNodePosByGridIndex(monsterPosIndex, roomData);
        monsterData.push({
            id: monsterId,
            pos: monsterPos,
            faction: FactionType.ENEMY,
            extraComp: [],
        });

        roomData.role = monsterData;
    }
}
