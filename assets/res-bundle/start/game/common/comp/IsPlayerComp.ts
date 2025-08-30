import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { RoleModelComp } from '../../role/comp/RoleModelComp';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { RoleEntity } from '../../role/entity/RoleEntity';
import { BattleController } from 'db://assets/app-builtin/app-controller/BattleController';

/**
 * 玩家组件
 */
@ecs.register('IsPlayerComp')
export class IsPlayerComp extends ecs.Comp {
    reset(): void {}
}

/**禁足系统 */
export class IsPlayerSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate
{
    filter(): ecs.IMatcher {
        return ecs.allOf(IsPlayerComp, RoleModelComp);
    }

    entityEnter(e: RoleEntity): void {
        ecs.getSingleton(GameModelComp).playerEntity = e;
        BattleController.inst.updatePlayerBagUI();
    }

    update(_e: ECSEntity): void {
        BattleController.inst.updatePlayerProgressUI();
    }
}
