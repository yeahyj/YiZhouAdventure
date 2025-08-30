import { Prefab, instantiate } from 'cc';
import { _decorator } from 'cc';
import { ProjectileStoneComp } from './base/ProjectileStoneComp';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { UnitComp } from '../../role/comp/UnitComp';
import { app } from '../../../../../app/app';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { MapLayersType } from '../../../../../app-builtin/app-model/export.type';
import { MapModelComp } from '../../map/comp/MapModelComp';

const { ccclass, property } = _decorator;

/**
 * 炸弹爆炸
 */
@ccclass('BombExplosionComp')
@ecs.register('BombExplosionComp')
export class BombExplosionComp extends ProjectileStoneComp {
    reset(): void {}
}

/**炸弹爆炸系统 */
export class BombExplosionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(BombExplosionComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        app.manager.loader.load({
            path: 'skill/bomb/BombExplosion',
            bundle: 'battle',
            type: Prefab,
            onComplete: (result: Prefab) => {
                if (!e.get(EnabledComp)) {
                    console.log('技能已经被销毁');
                    return;
                }

                let node = instantiate(result);
                e.get(UnitComp).unit = node.getComponent(BaseUnit);
                node.getComponent(BaseUnit).ent = e;
               ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).addNodeToRoom(node, MapLayersType.ENTITY);
                node.setPosition(e.get(PositionComp).getPosition());
            },
        });
    }

    private exit(e: ecs.Entity) {}
}
