import { _decorator, Component, Node } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

const { ccclass, property } = _decorator;

/**
 * 单位的法杖节点层
 */
@ccclass('UnitStaffLayerComp')
@ecs.register('UnitStaffLayerComp', false)
export class UnitStaffLayerComp extends Component implements ecs.IComp {
    static tid: number = -1;
    static compName: string;

    canRecycle: boolean = null!;
    ent: ecs.Entity = null!;

    addStaff(staff: Node) {
        this.node.addChild(staff);
    }

    reset(): void {}
}
