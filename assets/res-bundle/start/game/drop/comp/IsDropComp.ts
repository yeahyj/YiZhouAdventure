import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 掉落物组件
 */
@ecs.register('IsDropComp')
export class IsDropComp extends ecs.Comp {
    reset(): void { }
}
