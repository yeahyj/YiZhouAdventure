import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseViewComp } from '../../common/comp/base/BaseViewComp';

/**
 * 节点
 */
@ecs.register('ViewComp')
export class ViewComp extends ecs.Comp {
    /**单位节点 */
    view: BaseViewComp = null!;

    initView(view: BaseViewComp) {
        this.view = view;
    }

    reset(): void {
        this.view = null!;
    }
}
