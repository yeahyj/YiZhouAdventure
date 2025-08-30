import { _decorator } from 'cc';
import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { Vec3 } from 'cc';
import { FrameAnimation } from '../../../../../../pkg-export/@gamex/cc-comp-frame-animation';
import { UnitMagic } from '../UnitMagic';

const { ccclass, property } = _decorator;

/**
 * 黑洞
 */
@ccclass('BlackHole') // 定义为 Cocos Creator 组件
@ecs.register('BlackHole', false) // 定义为 ECS 组件
export class BlackHole extends UnitMagic {
    @property(FrameAnimation)
    aniClip: FrameAnimation = null;

    onLoad(): void {
        // this.group = this.ent.get(FactionTypeComp).group;
        // this.agent = false;
        // this.center.x = 0;
        // this.center.y = 25;
        // this.maxRadius = 15;
        // this.ent.get(SkillCompManagerComp).addCompByid(200101);
        // this.ent.get(SkillCompManagerComp).addCompByid(200402);
        // this.ent.add(BlackHoleBuffComp);
        // super.onLoad();
    }

    /**设置方向 */
    setDirection(dir: Vec3) {
        let angle = Math.atan2(dir.y, dir.x);
        this.node.angle = (angle * 180) / Math.PI;
    }
}
