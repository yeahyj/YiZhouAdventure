import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ProjectileStoneComp } from './base/ProjectileStoneComp';
import BattleUtil from '../../common/help/util/BattleUtil';

const { ccclass, property } = _decorator;

/**
 * 火球
 */
@ccclass('FireballComp')
@ecs.register('FireballComp')
export class FireballComp extends ProjectileStoneComp {
    reset(): void {}
}

/**火球系统 */
export class FireballSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(FireballComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        let projectileId = 100101; //投射物id
        BattleUtil.createMagicProjectile({
            ent: e,
            id: projectileId,
        });
    }

    private exit(e: ecs.Entity) {}
}
