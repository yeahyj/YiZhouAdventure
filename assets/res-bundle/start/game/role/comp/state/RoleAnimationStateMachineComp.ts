import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { AnimationEventData } from '../../../common/help/CommonInterface';
import { RoleMoviePriorityType } from '../../help/RoleConst';
import { RoleAnimationStateType, RoleBehaviorStateType } from '../../help/RoleEnum';
import { ViewComp } from '../ViewComp';
import { RoleBehaviorStateMachineComp } from './RoleBehaviorStateMachineComp';

/**角色动画状态机组件 */
@ecs.register('RoleAnimationStateMachineComp')
export class RoleAnimationStateMachineComp extends ecs.Comp {
    /**当前状态类型 */
    currentStateType: AnimationEventData | null = null;
    /**下一个状态类型 */
    nextStateTypeArr: AnimationEventData[] = [];

    /**重置状态 */
    resetState() {
        this.nextStateTypeArr = [];
        this.currentStateType = null;
    }

    /**
     * 播放动画
     * @param data 动画数据
     * @param isReset 是否重置状态
     */
    playAnimation(data: AnimationEventData, isReset = false) {
        if (isReset && this.currentStateType != null && this.currentStateType.name != data.name) {
            this.resetState();
        }
        this.nextStateTypeArr.push(data);
    }

    reset(): void {
        this.nextStateTypeArr = [];
        this.currentStateType = null;
    }
}

/**角色动画状态机系统 */
export class RoleAnimationStateMachineSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoleAnimationStateMachineComp, ViewComp);
    }

    update(e: ecs.Entity): void {
        const stateMachineComp = e.get(RoleAnimationStateMachineComp);
        if (stateMachineComp.nextStateTypeArr.length > 0) {
            let behaviorStateMachineComp = e.get(RoleBehaviorStateMachineComp);
            let curWeight = stateMachineComp.currentStateType
                ? RoleMoviePriorityType[stateMachineComp.currentStateType.name as RoleAnimationStateType]
                : null;
            let lastIndex = -1;
            for (let i = 0; i < stateMachineComp.nextStateTypeArr.length; i++) {
                const nextStateType = stateMachineComp.nextStateTypeArr[i];

                if (
                    nextStateType.name == RoleAnimationStateType.IDLE ||
                    nextStateType.name == RoleAnimationStateType.WALK ||
                    nextStateType.name == RoleAnimationStateType.DEATH ||
                    behaviorStateMachineComp.currentStateType == RoleBehaviorStateType.Attack
                ) {
                    if (
                        curWeight == null ||
                        RoleMoviePriorityType[nextStateType.name as RoleAnimationStateType] < curWeight
                    ) {
                        lastIndex = i;
                        curWeight = RoleMoviePriorityType[nextStateType.name as RoleAnimationStateType];
                    }
                }
            }

            if (
                lastIndex >= 0 &&
                stateMachineComp.nextStateTypeArr[lastIndex] &&
                (!stateMachineComp.currentStateType ||
                    stateMachineComp.nextStateTypeArr[lastIndex].name !== stateMachineComp.currentStateType.name)
            ) {
                let view = e.get(ViewComp).view;
                view.playAnimation(stateMachineComp.nextStateTypeArr[lastIndex]);
                stateMachineComp.currentStateType = stateMachineComp.nextStateTypeArr[lastIndex];
            }

            stateMachineComp.nextStateTypeArr = [];
        }
    }
}
