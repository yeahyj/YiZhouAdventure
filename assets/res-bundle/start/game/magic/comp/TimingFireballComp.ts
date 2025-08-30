import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ProjectileStoneComp } from './base/ProjectileStoneComp';
import { js } from 'cc';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';
import { MagicManagerComp } from './MagicManagerComp';
import { getMagicStonesConfig } from '../../../../base/config/MagicStonesConfig';
import BattleUtil from '../../common/help/util/BattleUtil';
import { StoneId } from '../../staff/help/StaffEnum';

const { ccclass, property } = _decorator;

/**
 * 定时触发火球
 */
@ccclass('TimingFireballComp')
@ecs.register('TimingFireballComp')
export class TimingFireballComp extends ProjectileStoneComp {
    initStone() {
        let stoneId = StoneId.TriggerTimingComp;
        let config = getMagicStonesConfig(stoneId)!;
        let plugCompObj = js.getClassByName(config.className as any);
        let plugComp: BaseMagicStoneComp = new (plugCompObj as any)();
        this.extraModifyStone.push(plugComp);
        plugComp.init({
            staffModel: this.staffModel,
            stoneId: stoneId,
            projectileStone: [],
            modifyStone: [],
        });
    }
}

/**定时触发火球系统 */
export class TimingFireballSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(TimingFireballComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        let projectileId = 100101; //投射物id
        BattleUtil.createMagicProjectile({
            ent: e,
            id: projectileId,
        });

        let comp = e.get(TimingFireballComp);
        for (let i = 0; i < comp.extraModifyStone.length; i++) {
            let stoneId = comp.extraModifyStone[i];
            e.get(MagicManagerComp).addComp(stoneId);
        }
    }

    private exit(e: ecs.Entity) {}
}
