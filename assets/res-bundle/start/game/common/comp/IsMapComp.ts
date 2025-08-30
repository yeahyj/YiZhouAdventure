import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 地图组件
 */
@ecs.register('IsMapComp')
export class IsMapComp extends ecs.Comp {
    reset(): void {}
}
