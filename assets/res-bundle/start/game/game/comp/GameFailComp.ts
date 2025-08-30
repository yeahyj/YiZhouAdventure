import { app } from '../../../../../app/app';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { GameModelComp } from './GameModelComp';
import { SwitchMapComp } from './SwitchMapComp';

/**
 *  游戏失败组件
 */
@ecs.register('GameFailComp')
export class GameFailComp extends ecs.Comp {
    reset(): void {}
}

export class GameFailSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(GameFailComp);
    }

    constructor() {
        super();
    }
    entityEnter(e: ECSEntity): void {
        ecs.getSingleton(GameModelComp).gameEntity.add(SwitchMapComp).mapId = 1;
        app.manager.ui.showToast('游戏失败');
    }
}
