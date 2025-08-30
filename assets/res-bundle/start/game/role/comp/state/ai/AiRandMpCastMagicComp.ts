import { ecs } from '../../../../../../base/extensions/cc-ecs/ECS';
import { MpComp } from '../../../../staff/comp/MpComp';
import CommonUtil from '../../../../common/help/util/CommonUtil';
import { StaffBagComp } from '../../StaffBagComp';
import { GameModelComp } from '../../../../game/comp/GameModelComp';
import { StaffModelComp } from '../../../../staff/comp/StaffModelComp';
import { StaffAttributeType } from '../../../../staff/help/StaffEnum';
import { KeepCastAtkRoleComp } from '../../KeepCastAtkRoleComp';

/** 施法状态枚举 */
export enum CastState {
    IDLE = 'IDLE',
    CASTING = 'CASTING',
    WAITING = 'WAITING',
}

/**
 * AI随机MP施法组件
 */
@ecs.register('AiRandMpCastMagicComp')
export class AiRandMpCastMagicComp extends ecs.Comp {
    // 施法状态
    state: CastState = CastState.IDLE;
    // 初始MP值
    initialMp: number = 0;
    // 目标MP值
    targetMp: number = 0;
    // 最大施法时间（秒）
    readonly maxCastTime: number = 3;
    // 当前施法时间
    currentCastTime: number = 0;
    // 等待时间（秒）
    waitTime: number = 0;
    // 最小等待时间
    readonly minWaitTime: number = 1;
    // 最大等待时间
    readonly maxWaitTime: number = 3;
    // 最小MP消耗
    readonly minMpCost: number = 1;

    reset(): void {
        this.state = CastState.IDLE;
        this.initialMp = 0;
        this.targetMp = 0;
        this.currentCastTime = 0;
        this.waitTime = 0;
    }

    /**
     * 计算随机目标MP值
     */
    calculateTargetMp(currentMp: number, maxMp: number): number {
        const maxPossibleMp = Math.min(currentMp, maxMp);
        return Math.max(0, maxPossibleMp - CommonUtil.randomBetween(this.minMpCost, maxPossibleMp));
    }

    /**
     * 设置随机等待时间
     */
    setRandomWaitTime(): void {
        this.waitTime = CommonUtil.randomBetween(this.minWaitTime, this.maxWaitTime);
    }
}

/**AI随机MP施法系统 */
export class AiRandMpCastMagicSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(AiRandMpCastMagicComp, StaffBagComp);
    }

    update(e: ecs.Entity): void {
        const staff = e.get(StaffBagComp).getUsingStaff();
        if (!staff) return;

        const aiComp = e.get(AiRandMpCastMagicComp);
        const mpComp = staff.get(MpComp);
        const dt = this.dt;

        switch (aiComp.state) {
            case CastState.WAITING:
                this.handleWaitingState(aiComp, dt);
                break;
            case CastState.IDLE:
                this.startNewCast(e, aiComp, mpComp);
                break;
            case CastState.CASTING:
                this.handleCastingState(e, aiComp, mpComp, dt);
                break;
        }
    }

    private handleWaitingState(aiComp: AiRandMpCastMagicComp, dt: number): void {
        aiComp.waitTime -= dt;
        if (aiComp.waitTime <= 0) {
            aiComp.state = CastState.IDLE;
        }
    }

    private handleCastingState(e: ecs.Entity, aiComp: AiRandMpCastMagicComp, mpComp: MpComp, dt: number): void {
        aiComp.currentCastTime += dt;

        if (this.shouldEndCast(aiComp, mpComp)) {
            this.endCast(e, aiComp, mpComp);
            return;
        }

        this.ensureKeepCasting(e);
    }

    private startNewCast(e: ecs.Entity, aiComp: AiRandMpCastMagicComp, mpComp: MpComp): void {
        // 记录初始MP
        aiComp.initialMp = mpComp.mp;

        // 获取最大MP
        const staff = this.getStaff(e);
        if (!staff) return;

        const mpMax = staff.get(StaffModelComp).attributes[StaffAttributeType.mpMax];

        // 设置目标MP
        aiComp.targetMp = aiComp.calculateTargetMp(mpComp.mp, mpMax);

        // 初始化施法状态
        aiComp.currentCastTime = 0;
        aiComp.state = CastState.CASTING;

        // 开始施法
        this.ensureKeepCasting(e);
    }

    private shouldEndCast(aiComp: AiRandMpCastMagicComp, mpComp: MpComp): boolean {
        return mpComp.mp <= aiComp.targetMp || aiComp.currentCastTime >= aiComp.maxCastTime;
    }

    private endCast(e: ecs.Entity, aiComp: AiRandMpCastMagicComp, mpComp: MpComp): void {
        // 恢复初始MP
        mpComp.mp = aiComp.initialMp;

        // 设置等待状态
        aiComp.setRandomWaitTime();
        aiComp.state = CastState.WAITING;

        // 停止施法
        this.stopCasting(e);
    }

    private getStaff(e: ecs.Entity): ecs.Entity | null {
        const staffBagComp = e.get(StaffBagComp);
        return staffBagComp.getUsingStaff();
    }

    private ensureKeepCasting(e: ecs.Entity): void {
        if (!e.has(KeepCastAtkRoleComp)) {
            e.add(KeepCastAtkRoleComp).target = ecs.getSingleton(GameModelComp).playerEntity;
        }
    }

    private stopCasting(e: ecs.Entity): void {
        if (e.has(KeepCastAtkRoleComp)) {
            e.remove(KeepCastAtkRoleComp);
        }
    }
}
