import { BattleController } from '../../../../../../app-builtin/app-controller/BattleController';
import { app } from '../../../../../../app/app';
import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { IsPlayerComp } from '../../../common/comp/IsPlayerComp';
import { UnitComp } from '../UnitComp';

/**
 * 死亡
 */
@ecs.register('DeathComp')
export class DeathComp extends ecs.Comp {
    reset(): void {}
}

/**死亡系统 */
export class DeathSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DeathComp, UnitComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        if (e.get(IsPlayerComp)) {
            app.manager.ui.showToast('死亡');
            BattleController.inst.playerDead();
        } else {
            console.log('死亡' + e.get(UnitComp).unit.name, e);
            e.destroy();
        }
    }
}
