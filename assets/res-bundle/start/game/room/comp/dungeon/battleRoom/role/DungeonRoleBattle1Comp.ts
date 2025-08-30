import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { FactionType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import BattleUtil from 'db://assets/res-bundle/start/game/common/help/util/BattleUtil';
import { DungeonRoleId } from 'db://assets/res-bundle/start/game/role/help/RoleEnum';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import { RoomEntity } from 'db://assets/res-bundle/start/game/room/entity/RoomEntity';
import { IRoomRole } from 'db://assets/res-bundle/start/game/room/help/RoomInterface';
/**
 * 对战房间,随机生成一个拿着法杖的敌人
 */
@ecs.register('DungeonRoleBattle1Comp')
export class DungeonRoleBattle1Comp extends ecs.Comp {
    reset(): void {}
}

/**对战房间怪物系统 */
export class DungeonRoleBattle1System extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonRoleBattle1Comp, RoomModelComp);
    }

    entityEnter(e: RoomEntity): void {
        this.randomGenerateEnemyRole(e);
        e.remove(DungeonRoleBattle1Comp);
    }

    /**随机生成怪物 */
    private randomGenerateEnemyRole(e: RoomEntity) {
        let roomData = e.get(RoomModelComp).roomData;
        let monsterData: IRoomRole[] = [];
        let monsterId = DungeonRoleId.DUNGEON_GIRL;
        let monsterPosIndex = BattleUtil.randomMoveTiledIndex(e);
        let monsterPos = BattleUtil.getNodePosByGridIndex(monsterPosIndex, e);
        monsterData.push({
            id: monsterId,
            pos: monsterPos,
            faction: FactionType.ENEMY,
            extraComp: [],
        });

        roomData.role = monsterData;
    }
}
