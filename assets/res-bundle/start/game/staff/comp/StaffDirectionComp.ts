import { Vec3, v3 } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { UnitComp } from '../../role/comp/UnitComp';

/**
 * 武器方向组件
 */
@ecs.register('StaffDirectionComp')
export class StaffDirectionComp extends ecs.Comp {
    /**方向 */
    _direction: Vec3 = v3(0, 0, 0);

    public get direction(): Vec3 {
        return this._direction;
    }
    public set direction(value: Vec3) {
        this._direction.x = value.x;
        this._direction.y = value.y;
    }

    reset(): void {}
}

/**武器方向系统 */
export class StaffDirectionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(StaffDirectionComp, UnitComp);
    }

    update(e: ecs.Entity): void {
        let unit = e.get(UnitComp).unit;
        let dirComp = e.get(StaffDirectionComp);
        if (unit) {
            let role = e.parent;
            if (role && role.get(UnitComp)) {
                let roleScale = role.get(UnitComp).unit.node.scale;
                unit.setScale(roleScale);
            }
            unit.setRotationByDir(dirComp.direction);
        }
    }
}
