import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { RoleModelComp } from './RoleModelComp';
import { WarehouseComp } from './WarehouseComp';
import { ItemType } from '../../common/help/CommonEnum';

/**
 * 测试角色属性
 */
@ecs.register('TestRoleAttributeComp')
export class TestRoleAttributeComp extends ecs.Comp {
    reset(): void {}
}

/**网格移动系统 */
export class TestRoleAttributeSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(TestRoleAttributeComp, RoleModelComp, WarehouseComp);
    }

    entityEnter(e: ecs.Entity): void {
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100101, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100102, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100102, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100103, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100103, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100104, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100104, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100301, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 100301, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 200101, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 200102, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 200201, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 200201, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 200201, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 200201, 1);
        e.get(WarehouseComp).addProp(ItemType.MAGIC_STONE, 200501, 1);
    }
}
