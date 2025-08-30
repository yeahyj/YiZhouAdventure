import { Node } from 'cc';
import { _decorator, Label } from 'cc';
import { ListView } from 'db://assets/pkg-export/@colayue/cc-comp-list-view';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { AttributeDesc } from 'db://assets/res-bundle/start/game/common/help/CommonConst';
import { AttributeType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import { GameModelComp } from 'db://assets/res-bundle/start/game/game/comp/GameModelComp';
import { RoleModelComp } from 'db://assets/res-bundle/start/game/role/comp/RoleModelComp';
import { BaseSetItem } from './BaseSetItem';

const { ccclass, property } = _decorator;

@ccclass('PlayerInfoItem')
export class PlayerInfoItem extends BaseSetItem {
    @property(ListView)
    attributeList: ListView = null!;

    commonAttributes: AttributeType[] = [];
    roleAttributes: AttributeType[] = [];
    protected onLoad(): void {
        this.commonAttributes = [
            AttributeType.hp,
            AttributeType.hpRecover,
            AttributeType.atk,
            AttributeType.speed,
            AttributeType.crit,
            AttributeType.critDamage,
            AttributeType.reflectDamage,
        ];
        this.roleAttributes = [AttributeType.cdReduce, AttributeType.atkSpeed];

        this.attributeList.count = [...this.commonAttributes, ...this.roleAttributes].length;
    }

    onRenderEvent(node: Node, index: number) {
        let attribute = null;
        let attributes = null;
        if (index < this.commonAttributes.length) {
            attribute = this.commonAttributes[index];
            attributes = ecs.getSingleton(GameModelComp).playerEntity.get(RoleModelComp).commonAttributes;
        } else {
            attribute = this.roleAttributes[index - this.commonAttributes.length];
            attributes = ecs.getSingleton(GameModelComp).playerEntity.get(RoleModelComp).roleAttributes;
        }

        let attributeData = attributes.attributes.getValue(attribute);
        node.getChildByName('name')!.getComponent(Label)!.string = AttributeDesc[attribute];
        node.getChildByName('value')!.getComponent(Label)!.string = attributeData.toString();
    }
}
