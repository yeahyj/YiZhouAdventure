import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { IsPlayerSystem } from '../../common/comp/IsPlayerComp';
import { KeepCastAtkRoleSystem } from '../../role/comp/KeepCastAtkRoleComp';
import { AiRandMpCastMagicSystem } from '../../role/comp/state/ai/AiRandMpCastMagicComp';
import { AiShoppingGirlSystem } from '../../role/comp/state/ai/AiShoppingGirlComp';
import { ChaseStateNormalSystem } from '../../role/comp/state/chase/ChaseStateNormalComp';
import { IdleStateNormalSystem } from '../../role/comp/state/idle/IdleStateNormalComp';
import { RoleAnimationStateMachineSystem } from '../../role/comp/state/RoleAnimationStateMachineComp';
import { StateMachineSystem } from '../../role/comp/state/RoleBehaviorStateMachineComp';
import { TestRoleAttributeSystem } from '../../role/comp/TestRoleAttributeComp';
import { TiledMoveSystem } from '../../role/comp/TiledMoveComp';

/**角色组系统 */
export class RoleGroupSystem extends ecs.System {
    constructor() {
        super();

        this.add(new TestRoleAttributeSystem());
        this.add(new IsPlayerSystem());

        this.add(new RoleAnimationStateMachineSystem());
        this.add(new StateMachineSystem());

        this.add(new TiledMoveSystem());
        //角色行为
        this.add(new IdleStateNormalSystem());
        this.add(new ChaseStateNormalSystem());

        this.add(new AiShoppingGirlSystem());
        this.add(new AiRandMpCastMagicSystem());
        this.add(new KeepCastAtkRoleSystem());
    }
}
