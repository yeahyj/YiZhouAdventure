import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BlackHoleNegativeEffectSystem } from '../../magic/comp/effect/BlackHoleNegativeEffectComp';

/**
 * 效果组系统
 * 负责属性的修改
 */
export class EffectGroupSystem extends ecs.System {
    constructor() {
        super();

        this.add(new BlackHoleNegativeEffectSystem());
    }
}
