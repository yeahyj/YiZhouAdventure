import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ItemData } from '../../common/help/CommonInterface';

/**
 * 技能数据
 */
@ecs.register('DropModelComp')
export class DropModelComp extends ecs.Comp {
    data: ItemData = null!;

    init(data: ItemData) {
        this.data = data;
    }

    reset(): void {}
}
