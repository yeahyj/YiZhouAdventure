import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { MarkerCollisionComp } from '../../common/comp/mark/MarkerCollisionComp';
import { RestrictMoveComp } from '../../role/comp/RestrictMoveComp';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';

const { ccclass, property } = _decorator;

/**
 *  碰撞静止组件
 */
@ccclass('CollisionMotionlessComp')
@ecs.register('CollisionMotionlessComp')
export class CollisionMotionlessComp extends BaseMagicStoneComp {}

/**碰撞静止系统 */
export class CollisionMotionlessSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(CollisionMotionlessComp, MarkerCollisionComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        e.add(RestrictMoveComp).coolTime = 999;
        e.remove(CollisionMotionlessComp);
    }
}
