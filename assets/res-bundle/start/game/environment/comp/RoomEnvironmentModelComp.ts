import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { RoomEnvironment } from '../../room/help/RoomInterface';

/**
 * 地图元素模型组件
 */
@ecs.register('RoomEnvironmentModelComp')
export class RoomEnvironmentModelComp extends ecs.Comp {
    /**初始数据 */
    initData: RoomEnvironment = null!;
    /**额外数据 */
    extraData: any = null;

    init(data: { environmentData: RoomEnvironment; extraData?: any }): void {
        this.initData = data.environmentData;
        this.extraData = data.extraData;
    }

    reset(): void {
        this.initData = null!;
        this.extraData = null;
    }
}
