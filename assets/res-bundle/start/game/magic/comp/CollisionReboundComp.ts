import { Vec3 } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { MarkerCollisionComp } from '../../common/comp/mark/MarkerCollisionComp';
import { DirectionComp } from '../../role/comp/DirectionComp';
import { MagicMoveLinearComp } from './motion/MagicMoveLinearComp';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';
import { _decorator } from 'cc';
import { DirectionWeight } from '../../common/help/CommonEnum';

const { ccclass, property } = _decorator;

/**
 *  碰撞回弹组件
 */
@ccclass('CollisionReboundComp')
@ecs.register('CollisionReboundComp')
export class CollisionReboundComp extends BaseMagicStoneComp {}

/**碰撞回弹系统 */
export class CollisionReboundSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(CollisionReboundComp, MarkerCollisionComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        //随机方向
        let direction = new Vec3(Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
        e.get(DirectionComp).setDirection({ dir: direction, weight: DirectionWeight.move });
        e.get(MagicMoveLinearComp).direction = direction;
    }
}
