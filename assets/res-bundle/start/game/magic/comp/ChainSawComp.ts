import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ProjectileStoneComp } from './base/ProjectileStoneComp';
import { CollisionMotionlessComp } from './CollisionMotionlessComp';
import { CollisionReboundComp } from './CollisionReboundComp';
import BattleUtil from '../../common/help/util/BattleUtil';

const { ccclass, property } = _decorator;

/**
 *  链锯
 */
@ccclass('ChainSawComp')
@ecs.register('ChainSawComp')
export class ChainSawComp extends ProjectileStoneComp {
    reset(): void {}
}

/**链锯系统 */
export class ChainSawSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ChainSawComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        let projectileId = 100301; //投射物id
        BattleUtil.createMagicProjectile({
            ent: e,
            id: projectileId,
        });

        //一般概率反弹，一般概率静止
        if (Math.random() < 0.5) {
            e.add(CollisionReboundComp);
        } else {
            e.add(CollisionMotionlessComp);
        }
    }

    private exit(e: ecs.Entity) {}
}
