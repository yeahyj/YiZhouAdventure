import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 游戏组件
 */
@ecs.register('IsGameComp')
export class IsGameComp extends ecs.Comp {
    reset(): void {}
}
