import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**状态组件 */
export class BaseRoleStateComp extends ecs.Comp {
    /**
     * 初始化状态
     * @param fixData 固定数据,在添加状态的时候传入的参数
     * @param stateData 状态数据，在切换到状态的时候传入的参数
     */
    initState(fixData: any, stateData: any): void {}
    /**重置状态 */
    reset(): void {}
}
