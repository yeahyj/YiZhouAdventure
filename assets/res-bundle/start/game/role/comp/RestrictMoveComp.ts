import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { Vec3 } from 'cc';
import { DirectionComp } from './DirectionComp';
import { DirectionWeight } from '../../common/help/CommonEnum';

/**
 * 禁足组件
 * 用于禁止角色移动
 */
@ecs.register('RestrictMoveComp')
export class RestrictMoveComp extends ecs.Comp {
    //冷却时间
    coolTime: number = 5;
    //当前时间
    curTime: number = 0;

    reset(): void {}
}

/**禁足系统 */
export class RestrictMoveSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(RestrictMoveComp);
    }

    constructor() {
        super();
    }

    update(e: ECSEntity): void {
        let comp = e.get(RestrictMoveComp);
        if (comp.curTime < comp.coolTime) {
            e.get(DirectionComp).setDirection({ dir: new Vec3(0, 0, 0), weight: DirectionWeight.castImmobility });
            comp.curTime += this.dt;
        } else {
            e.remove(RestrictMoveComp);
        }
    }
}
