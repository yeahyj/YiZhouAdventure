import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ProjectileStoneComp } from './base/ProjectileStoneComp';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { DeathBeforeComp } from '../../role/comp/death/DeathBeforeComp';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { DirectionalFlyMoveComp } from '../../role/comp/DirectionalFlyMoveComp';
import { PositionComp } from '../../role/comp/PositionComp';

const { ccclass, property } = _decorator;

/**
 * 飞爪
 */
@ccclass('FlyingHooksComp')
@ecs.register('FlyingHooksComp')
export class FlyingHooksComp extends ProjectileStoneComp {
    reset(): void {}
}

/**飞爪系统 */
export class FlyingHooksSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(FlyingHooksComp, DeathBeforeComp);
    }

    constructor() {
        super();
    }
    entityEnter(e: ECSEntity): void {
        let role = e.parent;
        if (role && role.get(EnabledComp)) {
            //TODO:后面判断角色是否死亡
            role.add(DirectionalFlyMoveComp).flyTarget = e.get(PositionComp).getPosition(true);
        }
    }
}
