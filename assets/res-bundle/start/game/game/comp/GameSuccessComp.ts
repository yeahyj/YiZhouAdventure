import { app } from '../../../../../app/app';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';

/**
 *  游戏成功组件
 */
@ecs.register('GameSuccessComp')
export class GameSuccessComp extends ecs.Comp {
    reset(): void {}
}

export class GameSuccessSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(GameSuccessComp);
    }

    constructor() {
        super();
    }
    entityEnter(e: ECSEntity): void {
        app.manager.ui.showToast('游戏成功');
    }
}
