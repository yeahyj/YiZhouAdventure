import { DeathComp } from './DeathComp';
import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';
import { app } from '../../../../../../app/app';

/**
 * 玩家死亡
 */
@ecs.register('DeathPlayerComp')
export class DeathPlayerComp extends ecs.Comp {
    reset(): void {}
}

/**死亡系统 */
export class DeathPlayerSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(DeathPlayerComp, DeathComp);
    }

    constructor() {
        super();
    }
    update(e: ECSEntity): void {
        app.manager.ui.showToast('玩家死亡');
    }

    private exit(e: ecs.Entity) {}
}
