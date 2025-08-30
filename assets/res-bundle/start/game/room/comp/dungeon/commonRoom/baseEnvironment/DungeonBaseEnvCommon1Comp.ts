import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { FloorType, WallType, DoorType } from 'db://assets/res-bundle/start/game/environment/help/EnvironmentEnum';
import { FloorData } from 'db://assets/res-bundle/start/game/environment/help/EnvironmentInterface';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
/**
 * 通用基础环境
 */
@ecs.register('DungeonBaseEnvCommon1Comp')
export class DungeonBaseEnvCommon1Comp extends ecs.Comp {
    reset(): void {}
}

/**通用基础环境系统 */
export class DungeonBaseEnvCommon1System extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonBaseEnvCommon1Comp, RoomModelComp);
    }

    entityEnter(e: ECSEntity): void {
        this.randomBaseEnvironment(e);
        e.remove(DungeonBaseEnvCommon1Comp);
    }

    /**随机生成基础环境 */
    private randomBaseEnvironment(e: ECSEntity) {
        let roomData = e.get(RoomModelComp).roomData;

        for (let i = 0; i < roomData.baseEnvironment.floor.length; i++) {
            let floorData = <FloorData>roomData.baseEnvironment.floor[i];
            floorData.data.resType = '1';
            floorData.type = FloorType.NORMAL;
        }

        for (let i = 0; i < roomData.baseEnvironment.wall.length; i++) {
            let wallData = roomData.baseEnvironment.wall[i];
            wallData.data.resType = '1';
            wallData.type = WallType.NORMAL;
        }

        //TODO:后面更具进门房间类型，生成对应的门
        for (let i = 0; i < roomData.baseEnvironment.door.length; i++) {
            let doorData = roomData.baseEnvironment.door[i];
            doorData.data.resType = '1';
            doorData.type = DoorType.NORMAL;
        }
    }
}
