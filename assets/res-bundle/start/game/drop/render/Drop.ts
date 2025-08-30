import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseUnit } from '../../common/render/base/BaseUnit';
const { ccclass, property } = _decorator;

/**
 * 掉落物
 */
@ccclass('Drop') // 定义为 Cocos Creator 组件
@ecs.register('Drop', false) // 定义为 ECS 组件
export class Drop extends BaseUnit {
    initUI() {
        // this.itemNode.getComponent(IconPrefab).updateUI(this.ent.get(DropModelComp).data);
    }
}
