import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 技能组件
 */
@ecs.register('IsSkillComp')
export class IsSkillComp extends ecs.Comp {
    reset(): void {}
}
