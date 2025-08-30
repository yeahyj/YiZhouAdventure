import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 武器组件
 */
@ecs.register('IsWeaponComp')
export class IsWeaponComp extends ecs.Comp {
    reset(): void {}
}
