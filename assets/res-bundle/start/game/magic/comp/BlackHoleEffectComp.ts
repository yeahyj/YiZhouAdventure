import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { MarkerCollisionComp } from '../../common/comp/mark/MarkerCollisionComp';
import { HpComp } from '../../role/comp/HpComp';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';
import { MarkerCollisionLeaveComp } from '../../common/comp/mark/MarkerCollisionLeaveComp';
import { BlackHoleNegativeEffectComp } from './effect/BlackHoleNegativeEffectComp';

const { ccclass, property } = _decorator;

/**
 * 黑洞buff，就是和这个实体碰撞后，会受到黑洞负效果
 */
@ccclass('BlackHoleEffectComp')
@ecs.register('BlackHoleEffectComp')
export class BlackHoleEffectComp extends BaseMagicStoneComp {}

/**黑洞buff系统 */
export class BlackHoleEffectSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BlackHoleEffectComp, MarkerCollisionComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        if (e.get(HpComp).currentHp > 0) {
            let enemyArr = e.get(MarkerCollisionComp).marks;
            for (let i = 0; i < enemyArr.length; i++) {
                let enemy = enemyArr[i].entity;
                if (enemy.get(HpComp).currentHp > 0) {
                    if (!enemy.has(BlackHoleNegativeEffectComp)) {
                        enemy.add(BlackHoleNegativeEffectComp);
                    }
                    enemy.get(BlackHoleNegativeEffectComp).addAffectNum(1);
                    enemy.get(BlackHoleNegativeEffectComp).pushBlackHoleEntity(e);
                }
            }
        }
    }
}

/**黑洞buff系统 */
export class RemoveBlackHoleEffectSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BlackHoleEffectComp, MarkerCollisionLeaveComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        let enemyArr = e.get(MarkerCollisionLeaveComp).leave;
        for (let i = 0; i < enemyArr.length; i++) {
            if (enemyArr[i].get(HpComp).currentHp > 0) {
                enemyArr[i].get(BlackHoleNegativeEffectComp).removeAffectNum(1);
                enemyArr[i].get(BlackHoleNegativeEffectComp).removeBlackHoleEntity(e);
            }
        }
    }
}
