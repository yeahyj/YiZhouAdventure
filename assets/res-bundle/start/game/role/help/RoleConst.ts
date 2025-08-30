import { RoleAnimationStateType } from './RoleEnum';

/**动画优先级 */
export const RoleMoviePriorityType: Record<RoleAnimationStateType, number> = {
    [RoleAnimationStateType.IDLE]: 300,
    [RoleAnimationStateType.WALK]: 200,
    [RoleAnimationStateType.ATTACK01]: 100,
    [RoleAnimationStateType.SKILL01]: 100,
    [RoleAnimationStateType.DEATH]: 1,
};

/**动画是否循环播放 */
export const RoleAnimationLoopType: Record<RoleAnimationStateType, boolean> = {
    [RoleAnimationStateType.IDLE]: true,
    [RoleAnimationStateType.WALK]: true,
    [RoleAnimationStateType.ATTACK01]: false,
    [RoleAnimationStateType.SKILL01]: false,
    [RoleAnimationStateType.DEATH]: false,
};
