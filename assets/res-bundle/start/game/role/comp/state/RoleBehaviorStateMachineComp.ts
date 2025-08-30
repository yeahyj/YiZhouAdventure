import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { CompType } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSModel';
import { RoleBehaviorStateType } from '../../help/RoleEnum';
import { RoleBehaviorStateData } from '../../help/RoleType';
import { BaseRoleStateComp } from '../base/BaseRoleStateComp';
import { ViewComp } from '../ViewComp';

@ecs.register('RoleBehaviorStateMachineComp')
export class RoleBehaviorStateMachineComp extends ecs.Comp {
    states: Map<RoleBehaviorStateType, { comp: CompType<BaseRoleStateComp>; data: any }> = new Map();
    /**当前状态类型 */
    currentStateType: RoleBehaviorStateType | null = null;
    /**当前状态组件 */
    currentStateComp: CompType<BaseRoleStateComp> | null = null;
    /**下一个状态类型 */
    nextStateType: RoleBehaviorStateType | null = null;
    /**下一个状态会用到的数据 */
    nextData: any;

    addState(state: RoleBehaviorStateType, stateComp: CompType<BaseRoleStateComp>, data: any) {
        this.states.set(state, { comp: stateComp, data: data });
    }

    /**
     * 切换状态
     * @param data 状态数据
     * @param isUpdate 是否立即更新,只有角色初始化状态的时候才可以设置true
     */
    changeState(data: RoleBehaviorStateData) {
        this.nextStateType = data.state;
        this.nextData = data.data;
    }

    reset(): void {
        this.states.clear();
        this.currentStateComp = null;
        this.currentStateType = null;
        this.nextStateType = null;
        this.nextData = null;
    }
}

/**状态机系统 */
export class StateMachineSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoleBehaviorStateMachineComp, ViewComp);
    }

    update(e: ecs.Entity): void {
        const stateMachineComp = e.get(RoleBehaviorStateMachineComp);

        if (
            stateMachineComp.nextStateType &&
            stateMachineComp.states.has(stateMachineComp.nextStateType) &&
            stateMachineComp.nextStateType !== stateMachineComp.currentStateType
        ) {
            if (stateMachineComp.currentStateComp) {
                e.remove(stateMachineComp.currentStateComp);
            }
            let state = stateMachineComp.states.get(stateMachineComp.nextStateType)!;
            e.add(state.comp).initState(state.data, stateMachineComp.nextData);
            stateMachineComp.currentStateType = stateMachineComp.nextStateType;
            stateMachineComp.currentStateComp = state.comp;
            stateMachineComp.nextStateType = null;
            stateMachineComp.nextData = null;
        }
    }
}
