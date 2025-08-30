import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { GridEnterMapSystem } from '../../environment/comp/GridEnterMapComp';
import { GridPlayerEnterRoomSystem } from '../../environment/comp/GridPlayerEnterRoomComp';
import { SwitchMapSystem } from '../comp/SwitchMapComp';

/**游戏系统 */
export class GameGroupSystem extends ecs.System {
    constructor() {
        super();

        this.add(new GridPlayerEnterRoomSystem());
        this.add(new GridEnterMapSystem());
        this.add(new SwitchMapSystem());
    }
}
