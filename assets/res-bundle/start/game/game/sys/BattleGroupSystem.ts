import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { CollisionSystem } from '../../role/comp/CollisionComp';

/**游戏系统 */
export class BattleGroupSystem extends ecs.System {
    constructor() {
        super();

        this.add(new CollisionSystem());
    }
}
