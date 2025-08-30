import { _decorator } from 'cc';
import { UnitMagic } from 'db://assets/res-bundle/start/game/magic/comp/UnitMagic';
import { ecs } from '../../../../../../base/extensions/cc-ecs/ECS';
import { v3 } from 'cc';
import { VFXPercussionComp } from '../../../comp/vfx/VFXPercussionComp';

const { ccclass, property } = _decorator;

/**
 * 火球
 */
@ccclass('Fireball')
export class Fireball extends UnitMagic {
    init(data: { e: ecs.Entity; id: number }): void {
        super.init(data);
        this.ent.add(VFXPercussionComp);
        this.setScale(v3(0.6, 0.6, 0.6));
    }
}
