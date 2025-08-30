import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { UnitComp } from '../../role/comp/UnitComp';

/**
 * 基础实体
 */
export class BaseEntity extends ecs.Entity {
    protected init() {
        // 初始化实体常住 ECS 组件，定义实体特性
        this.addComponents<ecs.Comp>();
    }

    destroy(): void {
        // 销毁实体时，清理节点
        console.log('BaseEntity destroy');
        this.get(UnitComp)?.reset();
        super.destroy();
    }
}
