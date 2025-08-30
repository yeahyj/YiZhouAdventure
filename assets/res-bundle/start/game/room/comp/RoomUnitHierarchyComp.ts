import { MapLayerNames, MapLayersType } from '../../../../../app-builtin/app-model/export.type';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { UnitComp } from '../../role/comp/UnitComp';

/**
 * 单位层级排序
 */
@ecs.register('RoomUnitHierarchyComp')
export class RoomUnitHierarchyComp extends ecs.Comp {
    reset(): void {}
}

/**单位层级排序系统 */
export class RoomUnitHierarchySystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomUnitHierarchyComp, UnitComp);
    }

    update(entity: ECSEntity): void {
        let roomNode = entity.get(UnitComp).unit.node;
        let entityLayer = roomNode.getChildByName('layer_' + MapLayerNames[MapLayersType.ENTITY])!;
        //TODO:后续优化，不用全部重新排序
        const children = entityLayer.children;
        children.sort((a, b) => {
            return b.position.y - a.position.y;
        });
    }
}
