import { Vec3 } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import {
    CorrectionType,
    CorrectionSourceType,
    AttributeType,
    DirectionWeight,
} from '../../../../common/help/CommonEnum';
import { CorrectionAttributeData } from '../../../../common/help/CommonInterface';
import { RoleAnimationStateType, RoleBehaviorStateType } from '../../../help/RoleEnum';
import { DirectionComp } from '../../DirectionComp';
import { EnabledComp } from '../../EnabledComp';
import { RoleAttributeComp } from '../../RoleAttributeComp';
import { RoleAnimationStateMachineComp } from '../RoleAnimationStateMachineComp';
import { RoleBehaviorStateMachineComp } from '../RoleBehaviorStateMachineComp';

/**苍蝇冲撞技能 */
@ecs.register('AttackStateFlyComp')
export class AttackStateFlyComp extends ecs.Comp {
    maxVelocityCorrection: CorrectionAttributeData = null!;
    agentWeightCorrection: CorrectionAttributeData = null!;
    speedCorrection: CorrectionAttributeData = null!;
    reflectDamageCorrection: CorrectionAttributeData = null!;
    //方向
    direction: Vec3 = null!;

    initState(fixData: number, data: { chaseEntity: ecs.Entity; dir: Vec3 }): void {
        this.maxVelocityCorrection = {
            value: 0,
            type: CorrectionType.FIXED,
            source: CorrectionSourceType.SKILL,
        };
        this.agentWeightCorrection = {
            value: 0.1,
            type: CorrectionType.FIXED,
            source: CorrectionSourceType.SKILL,
        };
        this.speedCorrection = {
            value: 200,
            type: CorrectionType.MODIFIER,
            source: CorrectionSourceType.SKILL,
        };
        this.reflectDamageCorrection = {
            value: 10,
            type: CorrectionType.MODIFIER,
            source: CorrectionSourceType.SKILL,
        };

        //技能方向
        //技能方向
        this.direction = data.dir;
    }

    reset(): void {
        this.agentWeightCorrection = null!;
        this.maxVelocityCorrection = null!;
        this.speedCorrection = null!;
        this.direction = null!;
    }
}

/**苍蝇冲撞技能系统 */
export class AttackStateFlySystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate, ecs.IEntityRemoveSystem
{
    correctionAttributeData: Map<number, { [id: string]: CorrectionAttributeData }> = new Map();

    filter(): ecs.IMatcher {
        return ecs.allOf(AttackStateFlyComp, RoleAnimationStateMachineComp);
    }

    entityEnter(e: ECSEntity): void {
        let stateMachineComp = e.get(RoleAnimationStateMachineComp);
        stateMachineComp.playAnimation({
            name: RoleAnimationStateType.SKILL01,
            onComplete: () => {
                e.get(RoleBehaviorStateMachineComp).changeState({ state: RoleBehaviorStateType.Idle, data: null });
            },
        });

        let flyComp = e.get(AttackStateFlyComp);
        let attributeComp = e.get(RoleAttributeComp);
        attributeComp.addCorrection(AttributeType.maxVelocity, flyComp.maxVelocityCorrection);
        attributeComp.addCorrection(AttributeType.agentWeight, flyComp.agentWeightCorrection);
        attributeComp.addCorrection(AttributeType.speed, flyComp.speedCorrection);
        attributeComp.addCorrection(AttributeType.reflectDamage, flyComp.reflectDamageCorrection);
        this.correctionAttributeData.set(e.eid, {
            [AttributeType.maxVelocity]: flyComp.maxVelocityCorrection,
            [AttributeType.agentWeight]: flyComp.agentWeightCorrection,
            [AttributeType.speed]: flyComp.speedCorrection,
            [AttributeType.reflectDamage]: flyComp.reflectDamageCorrection,
        });
    }

    update(e: ECSEntity): void {
        let flyComp = e.get(AttackStateFlyComp);
        e.get(DirectionComp).setDirection({ dir: flyComp.direction, weight: DirectionWeight.skill });
    }

    entityRemove(e: ECSEntity): void {
        if (e.get(EnabledComp)) {
            let attributeComp = e.get(RoleAttributeComp);
            if (this.correctionAttributeData.get(e.eid)) {
                attributeComp.removeCorrection(
                    AttributeType.maxVelocity,
                    this.correctionAttributeData.get(e.eid)![AttributeType.maxVelocity],
                );
                attributeComp.removeCorrection(
                    AttributeType.agentWeight,
                    this.correctionAttributeData.get(e.eid)![AttributeType.agentWeight],
                );
                attributeComp.removeCorrection(
                    AttributeType.speed,
                    this.correctionAttributeData.get(e.eid)![AttributeType.speed],
                );
                attributeComp.removeCorrection(
                    AttributeType.reflectDamage,
                    this.correctionAttributeData.get(e.eid)![AttributeType.reflectDamage],
                );
                e.get(RoleBehaviorStateMachineComp).changeState({ state: RoleBehaviorStateType.Idle, data: null });
                e.get(RoleAnimationStateMachineComp).playAnimation({ name: RoleAnimationStateType.IDLE }, true);
            }
        }
        this.correctionAttributeData.delete(e.eid);
    }
}
