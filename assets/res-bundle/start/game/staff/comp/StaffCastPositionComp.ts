import { Component } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { _decorator } from 'cc';
import { Vec3 } from 'cc';
import { GameModelComp } from '../../game/comp/GameModelComp';

const { ccclass, property } = _decorator;
/**
 * 魔法杖使用位置组件
 */
@ccclass('StaffCastPositionComp')
@ecs.register('StaffCastPositionComp')
export class StaffCastPositionComp extends Component implements ecs.IComp {
    static tid: number = -1;
    static compName: string;

    canRecycle: boolean = null!;
    ent: ecs.Entity = null!;

    getCastPosition(): Vec3 {
        let pos = this.node.getWorldPosition();
        ecs.getSingleton(GameModelComp).mapNode!.parent!.inverseTransformPoint(pos, pos);
        return pos;
    }

    reset(): void {}
}
