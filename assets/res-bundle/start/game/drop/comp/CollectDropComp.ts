import { app } from 'db://assets/app/app';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { DeathBeforeComp } from '../../role/comp/death/DeathBeforeComp';
import { PositionComp } from '../../role/comp/PositionComp';

/**
 * 掉落物品组件
 */
@ecs.register('CollectDropComp')
export class CollectDropComp extends ecs.Comp {
    //是否在拾取范围
    isInCollectRange: boolean = false;

    reset(): void {}
}

/**掉落物品组件系统 */
export class CollectDropSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(CollectDropComp);
    }

    constructor() {
        super();
    }
    update(e: ECSEntity): void {
        let pos = e.get(PositionComp).getPosition(true);
        let playerPos = ecs.getSingleton(GameModelComp).playerEntity.get(PositionComp).getPosition(true);
        let dis = pos.subtract(playerPos).length();
        if (dis <= app.config.game.CollectItemDistance) {
            console.log('collect drop');
            e.add(DeathBeforeComp);
            // let result = app.store.player.addItemToBag(e.get(DropModelComp).data);
            // if (result) {
            //     e.remove(CollectDropComp);
            // } else if (!e.get(CollectDropComp).isInCollectRange) {
            //     e.get(CollectDropComp).isInCollectRange = true;
            //     app.manager.ui.showToast('背包已满');
            // }
        } else {
            e.get(CollectDropComp).isInCollectRange = false;
        }
    }
}
