import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ItemType } from '../../common/help/CommonEnum';
import { ItemData } from '../../common/help/CommonInterface';

const { ccclass, property, menu } = _decorator;

/**
 *  仓库
 */
@ecs.register('WarehouseComp')
export class WarehouseComp extends ecs.Comp {
    warehouse: Map<ItemType, (ItemData | null)[]> = new Map();

    addProp(type: ItemType, id: number, num: number) {
        let props = this.warehouse.get(type);
        if (!props) {
            props = [];
            this.warehouse.set(type, props);
        }
        //找出空位
        let index = props.findIndex((item) => !item);
        if (index == -1) {
            props.push({ type, id: id.toString(), count: num });
        } else {
            props[index] = { type, id: id.toString(), count: num };
        }
    }

    removeProp(type: ItemType, index: number) {
        let props = this.warehouse.get(type);
        if (!props) {
            return;
        }
        props[index] = null;
        //删除所有的null
        props = props.filter((item) => item);

        this.warehouse.set(type, props);
    }

    reset(): void {}
}
