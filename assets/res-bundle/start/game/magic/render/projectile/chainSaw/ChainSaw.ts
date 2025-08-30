import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { v3 } from 'cc';
import { VFXPercussionComp } from '../../../comp/vfx/VFXPercussionComp';
import { UnitMagic } from '../../../comp/UnitMagic';

const { ccclass, property } = _decorator;

/**
 * 链锯
 */
@ccclass('ChainSaw') // 定义为 Cocos Creator 组件
@ecs.register('ChainSaw', false) // 定义为 ECS 组件
export class ChainSaw extends UnitMagic {
    init(data: { e: ecs.Entity; id: number }): void {
        super.init(data);
        this.ent.add(VFXPercussionComp);
        this.setScale(v3(0.5, 0.5, 0.5));
    }
}
