import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseUnit } from '../../common/render/base/BaseUnit';

/**
 * 节点
 */
@ecs.register('UnitComp')
export class UnitComp extends ecs.Comp {
    /**单位节点 */
    unit: BaseUnit = null!;

    initUnit(unit: BaseUnit) {
        this.unit = unit;
    }

    reset(): void {
        this.unit?.node.destroy();
        this.unit = null!;
    }
}
