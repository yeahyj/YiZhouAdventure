import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { js } from 'cc';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';
import { MagicManagerComp } from './MagicManagerComp';
import BattleUtil from '../../common/help/util/BattleUtil';
import { getMagicStonesConfig } from '../../../../base/config/MagicStonesConfig';
import { StoneId } from '../../staff/help/StaffEnum';

const { ccclass, property } = _decorator;

/**
 * 碰撞触发火球
 */
@ccclass('CollisionFireballComp')
@ecs.register('CollisionFireballComp')
export class CollisionFireballComp extends BaseMagicStoneComp {
    initStone() {
        let stoneId = StoneId.TriggerCollisionComp;
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

/**碰撞触发火球系统 */
export class CollisionFireballSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(CollisionFireballComp);
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

        let comp = e.get(CollisionFireballComp);
        for (let i = 0; i < comp.extraModifyStone.length; i++) {
            let stone = comp.extraModifyStone[i];
            e.get(MagicManagerComp).addComp(stone);
        }
    }

    private exit(e: ecs.Entity) {}
}
