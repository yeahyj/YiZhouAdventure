import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseUnit } from '../../common/render/base/BaseUnit';

/**
 * 地图环境组件
 */
@ecs.register('RoomEnvironmentViewComp')
export class RoomEnvironmentViewComp extends BaseUnit {
    reset(): void {}
}
