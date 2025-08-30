import { ecs } from '../../../../base/extensions/cc-ecs/ECS';

/**
 * 法杖组件
 */
@ecs.register('IsStaffComp')
export class IsStaffComp extends ecs.Comp {
    reset(): void {}
}
