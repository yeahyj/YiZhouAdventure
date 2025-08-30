import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BagItemData } from '../../common/help/CommonInterface';

const { ccclass, property, menu } = _decorator;

/**
 *  仓库
 */
@ecs.register('PropBagComp')
export class PropBagComp extends ecs.Comp {
    /**道具最大数量 */
    maxNum: number = 3;
    /**道具袋 */
    bag: BagItemData[] = [];
    /**正在使用中的道具 */
    usingIndex: number = -1;

    getUsingProp(): BagItemData {
        return this.bag[this.usingIndex];
    }

    reset(): void {}
}
