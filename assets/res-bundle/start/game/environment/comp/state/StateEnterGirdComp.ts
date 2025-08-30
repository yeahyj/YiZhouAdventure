import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { StateEnterGirdState } from '../../help/EnvironmentEnum';

/**
 * 进入格子状态组件
 */
@ecs.register('StateEnterGirdComp')
export class StateEnterGirdComp extends ecs.Comp {
    /**格子移动类型 */
    state: StateEnterGirdState = StateEnterGirdState.ENTER;

    reset(): void {}
}
