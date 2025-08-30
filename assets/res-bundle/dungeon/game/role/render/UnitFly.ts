import { _decorator } from 'cc';
import { ChaseStateNormalComp } from '../../../../start/game/role/comp/state/chase/ChaseStateNormalComp';
import { IdleStateNormalComp } from '../../../../start/game/role/comp/state/idle/IdleStateNormalComp';
import { RoleBehaviorStateMachineComp } from '../../../../start/game/role/comp/state/RoleBehaviorStateMachineComp';
import { UnitRole } from '../../../../start/game/role/render/UnitRole';
import { AttackStateFlyComp } from 'db://assets/res-bundle/start/game/role/comp/state/attack/AttackStateFlyComp';
import { RoleBehaviorStateType } from 'db://assets/res-bundle/start/game/role/help/RoleEnum';
const { ccclass } = _decorator;

@ccclass('UnitFly')
export class UnitFly extends UnitRole {
    protected onLoad(): void {
        super.onLoad();
        let stateMachineComp = this.ent.get(RoleBehaviorStateMachineComp);
        stateMachineComp.addState(RoleBehaviorStateType.Idle, IdleStateNormalComp, null);
        stateMachineComp.addState(RoleBehaviorStateType.Chase, ChaseStateNormalComp, 400);
        stateMachineComp.addState(RoleBehaviorStateType.Attack, AttackStateFlyComp, null);
        stateMachineComp.changeState({ state: RoleBehaviorStateType.Idle, data: null });
    }
}
