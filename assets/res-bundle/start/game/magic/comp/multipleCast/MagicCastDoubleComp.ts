import { _decorator } from 'cc';
import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ProjectileStoneComp } from '../base/ProjectileStoneComp';
import { getMagicStonesConfig } from '../../../../../base/config/MagicStonesConfig';

const { ccclass, property } = _decorator;

/**
 * 二重施法
 */
@ccclass('MagicCastDoubleComp')
@ecs.register('MagicCastDoubleComp')
export class MagicCastDoubleComp extends ProjectileStoneComp {
    initStone() {
        let config = getMagicStonesConfig(this.stoneId);
        let extraCast = config.extraCast;
        let manager = this.staffModel;
        manager.castNum += extraCast;
    }

    reset(): void {}
}
