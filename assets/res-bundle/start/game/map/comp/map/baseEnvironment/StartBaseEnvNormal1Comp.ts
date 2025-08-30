import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import CommonUtil from '../../../../common/help/util/CommonUtil';
import { FloorType, WallType } from '../../../../environment/help/EnvironmentEnum';
import { FloorData, WallData } from '../../../../environment/help/EnvironmentInterface';
/**
 * 通用基础环境
 */
@ecs.register('StartBaseEnvNormal1Comp')
export class StartBaseEnvNormal1Comp extends ecs.Comp {
    onAdd(): void {
        this.randomBaseEnvironment();
    }

    /**随机生成基础环境 */
    private randomBaseEnvironment() {
        let roomData = this.ent.get(RoomModelComp).roomData;

        for (let i = 0; i < roomData.baseEnvironment.floor.length; i++) {
            let floorData = <FloorData>roomData.baseEnvironment.floor[i];
            let floorResType = ['start1', 'start2', 'start3'];
            floorData.data.resType = CommonUtil.randomArraySelect(floorResType);
            floorData.type = FloorType.START;
        }

        for (let i = 0; i < roomData.baseEnvironment.wall.length; i++) {
            let wallData = <WallData>roomData.baseEnvironment.wall[i];
            wallData.data.resType = '1';
            wallData.type = WallType.NORMAL;
        }
    }

    reset(): void {}
}
