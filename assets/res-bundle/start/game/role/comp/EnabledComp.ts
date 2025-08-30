import { ecs } from '../../../../base/extensions/cc-ecs/ECS';

/**
 * 有效组件
 */
@ecs.register('EnabledComp')
export class EnabledComp extends ecs.Comp {
    reset(): void {}
}
