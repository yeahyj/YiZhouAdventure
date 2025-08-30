import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { VFXPercussionSystem } from '../../magic/comp/vfx/VFXPercussionComp';

/**特效系统 */
export class VFXGroupSystem extends ecs.System {
    constructor() {
        super();

        this.add(new VFXPercussionSystem());
    }
}
