import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ProjectileStoneComp } from './base/ProjectileStoneComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { DeathBeforeComp } from '../../role/comp/death/DeathBeforeComp';
import { MagicModelComp } from './MagicModelComp';
import { CreateBombExplosionComp } from './CreateBombExplosionComp';
import { AttributeType } from '../../common/help/CommonEnum';

const { ccclass, property } = _decorator;

/**
 * 死亡后炸弹爆炸
 */
@ccclass('DeathBombExplosionComp')
@ecs.register('DeathBombExplosionComp')
export class DeathBombExplosionComp extends ProjectileStoneComp {
    reset(): void {}
}

/**死亡后炸弹爆炸系统 */
export class DeathBombExplosionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DeathBombExplosionComp, DeathBeforeComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        let comp = e.add(CreateBombExplosionComp);
        comp.initData({
            pos: e.get(PositionComp).getPosition(true),
            atk: e.get(MagicModelComp).commonAttributes.attributes.getValue(AttributeType.atk),
        });
        e.remove(DeathBombExplosionComp);
    }

    private exit(e: ecs.Entity) {}
}
