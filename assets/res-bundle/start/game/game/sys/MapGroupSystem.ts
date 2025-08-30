import { DungeonRoomNormalSystem } from 'db://assets/res-bundle/start/game/room/comp/dungeon/normalRoom/DungeonRoomNormalComp';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { DungeonBaseEnvCommon1System } from 'db://assets/res-bundle/start/game/room/comp/dungeon/commonRoom/baseEnvironment/DungeonBaseEnvCommon1Comp';
import { DungeonLayoutNormal1System } from 'db://assets/res-bundle/start/game/room/comp/dungeon/normalRoom/layout/DungeonLayoutNormal1Comp';
import { DungeonRoleNormal1System } from 'db://assets/res-bundle/start/game/room/comp/dungeon/normalRoom/role/DungeonRoleNormal1Comp';
import { RoomViewLoadSystem } from 'db://assets/res-bundle/start/game/room/comp/dungeon/RoomViewLoadComp';
import { RoomEnvironmentViewLoadSystem } from '../../environment/comp/RoomEnvironmentViewLoadComp';
import { StaffViewLoadSystem } from '../../staff/comp/StaffViewLoadComp';
import { RoleViewLoadSystem } from '../../role/comp/RoleViewLoadComp';
import { StartLayoutNormal1System } from '../../map/comp/map/layout/StartLayoutNormal1Comp';
import { DungeonRoomStartSystem } from 'db://assets/res-bundle/start/game/room/comp/dungeon/startRoom/DungeonRoomStartComp';
import { DungeonRoleBattle1System } from 'db://assets/res-bundle/start/game/room/comp/dungeon/battleRoom/role/DungeonRoleBattle1Comp';
import { DungeonRoomBossSystem } from 'db://assets/res-bundle/start/game/room/comp/dungeon/bossRoom/DungeonRoomBossComp';
import { DungeonRoomBattleSystem } from 'db://assets/res-bundle/start/game/room/comp/dungeon/battleRoom/DungeonRoomBattleComp';

/**地图系统 */
export class MapGroupSystem extends ecs.System {
    constructor() {
        super();

        //地图房间模式
        this.add(new DungeonRoomNormalSystem());
        this.add(new DungeonRoomStartSystem());
        this.add(new DungeonRoomBossSystem());
        this.add(new DungeonRoomBattleSystem());

        //地图房间基础环境
        this.add(new DungeonBaseEnvCommon1System());

        //地图房间布局
        this.add(new DungeonLayoutNormal1System());
        this.add(new StartLayoutNormal1System());

        //地图房间角色
        this.add(new DungeonRoleNormal1System());
        this.add(new DungeonRoleBattle1System());

        //加载地图房间
        this.add(new RoomViewLoadSystem());
        this.add(new RoomEnvironmentViewLoadSystem());
        this.add(new RoleViewLoadSystem());
        this.add(new StaffViewLoadSystem());
    }
}
