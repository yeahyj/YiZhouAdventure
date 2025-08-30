import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseEntity } from '../../common/entity/BaseEntity';
import { IsGameComp } from '../../common/comp/IsGameComp';

/**
 * 游戏实体
 */
@ecs.register('GameEntity')
export class GameEntity extends BaseEntity {
    protected init() {
        super.init();
        this.addComponents<ecs.Comp>(IsGameComp);
    }
}
