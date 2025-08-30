import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 魔法组件
 */
@ecs.register('IsMagicComp')
export class IsMagicComp extends ecs.Comp {
    reset(): void {}
}
