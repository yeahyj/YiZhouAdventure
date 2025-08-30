import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { UnitStaffLayerComp } from '../../role/comp/UnitStaffLayerComp';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { UnitComp } from '../../role/comp/UnitComp';

/**
 * 武器使用组件
 */
@ecs.register('StaffAddToUnitViewComp')
export class StaffAddToUnitViewComp extends ecs.Comp {
    reset(): void {}
}

/**武器使用系统 */
export class StaffAddToUnitViewSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(StaffAddToUnitViewComp, UnitComp);
    }

    entityEnter(entity: ECSEntity): void {
        let parentUnit = entity.parent!;
        let staffLayer = parentUnit.get(UnitStaffLayerComp);
        if (staffLayer) {
            let view = entity.get(UnitComp).unit.node;
            staffLayer.addStaff(view);
        }
    }

    entityRemove(entity: ECSEntity): void {
        if (entity.get(EnabledComp) && entity.get(UnitComp)) {
            let view = entity.get(UnitComp).unit.node;
            view.removeFromParent();
        }
    }
}
