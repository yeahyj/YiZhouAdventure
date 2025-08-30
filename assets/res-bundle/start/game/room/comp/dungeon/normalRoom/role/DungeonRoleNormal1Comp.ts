import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import BattleUtil from 'db://assets/res-bundle/start/game/common/help/util/BattleUtil';
import CommonUtil from 'db://assets/res-bundle/start/game/common/help/util/CommonUtil';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import { IRoomRole } from 'db://assets/res-bundle/start/game/room/help/RoomInterface';
import { RoomEntity } from 'db://assets/res-bundle/start/game/room/entity/RoomEntity';
import { FactionType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import { DungeonRoleId } from 'db://assets/res-bundle/start/game/role/help/RoleEnum';

/**
 * 普通房间角色,在房间中随机敌人角色
 */
@ecs.register('DungeonRoleNormal1Comp')
export class DungeonRoleNormal1Comp extends ecs.Comp {
    reset(): void {}
}

/**普通房间角色系统 */
export class DungeonRoleNormal1System extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonRoleNormal1Comp, RoomModelComp);
    }

    entityEnter(e: RoomEntity): void {
        this.randomGenerateEnemyRole(e);
        e.remove(DungeonRoleNormal1Comp);
    }

    /**随机生成敌人角色 */
    private randomGenerateEnemyRole(e: RoomEntity) {
        let roomData = e.get(RoomModelComp).roomData;
        let roleData: IRoomRole[] = [];
        let num = CommonUtil.randomBetween(1, 1);
        for (let i = 0; i < num; i++) {
            let monsterId = DungeonRoleId.DUNGEON_FLY;
            let monsterPosIndex = BattleUtil.randomMoveTiledIndex(e);
            let monsterPos = BattleUtil.getNodePosByGridIndex(monsterPosIndex, e);
            roleData.push({
                id: monsterId,
                pos: monsterPos,
                faction: FactionType.ENEMY,
                extraComp: [],
            });
        }
        roomData.role = roleData;
    }
}
