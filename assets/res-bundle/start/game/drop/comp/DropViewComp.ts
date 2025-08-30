import { Prefab, instantiate } from 'cc';
import { CollectDropComp } from './CollectDropComp';
import { app } from '../../../../../app/app';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { UnitComp } from '../../role/comp/UnitComp';
import { Drop } from '../render/Drop';
import { MapLayersType } from '../../../../../app-builtin/app-model/export.type';
import { MapModelComp } from '../../map/comp/MapModelComp';

/**
 * 掉落物品组件
 */
@ecs.register('DropViewComp')
export class DropViewComp extends ecs.Comp {
    reset(): void {}
}

/**掉落物品组件系统 */
export class DropViewSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DropViewComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        app.manager.loader.load({
            path: 'drop/Drop',
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
                node.getComponent(Drop).initUI();
                e.add(CollectDropComp);
            },
        });
    }
}
