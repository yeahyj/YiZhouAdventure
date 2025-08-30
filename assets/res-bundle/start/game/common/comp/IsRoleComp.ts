import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 是否是角色组件
 */
@ecs.register('IsRoleComp')
export class IsRoleComp extends ecs.Comp {
    reset(): void {}
}
