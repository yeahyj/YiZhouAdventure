import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { NPCInteractionMenuComp } from './NPCInteractionMenuComp';
import { PositionComp } from './PositionComp';

/**
 * 触发功能
 */
@ecs.register('TriggerNPCInteractionMenuComp')
export class TriggerNPCInteractionMenuComp extends ecs.Comp {
    //触发距离
    distance: number = 300;

    reset(): void {}
}

export class TriggerNPCInteractionMenuSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.ISystemUpdate, ecs.IEntityRemoveSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(TriggerNPCInteractionMenuComp);
    }

    constructor() {
        super();
    }

    update(e: ECSEntity): void {
        let player = ecs.getSingleton(GameModelComp).playerEntity;
        if (player) {
            let playerPos = player.get(PositionComp).getPosition(true);
            let comp = e.get(TriggerNPCInteractionMenuComp);
            let pos = e.get(PositionComp).getPosition(true);
            let dis = playerPos.subtract(pos).length();
            if (dis < comp.distance) {
                // //触发功能
                // let roleId = e.get(RoleModelComp).roleId;
                // let interaction = DB_UnitConfig[roleId].interaction;
                // if (interaction) {
                //     player
                //         .get(NPCInteractionMenuComp)
                //         .addInteraction({ id: e.eid, interaction: interaction, weight: dis });
                // }
            } else {
                player.get(NPCInteractionMenuComp).removeChat(e.eid);
            }
        }
    }

    entityRemove(e: ECSEntity): void {
        let player = ecs.getSingleton(GameModelComp).playerEntity;
        player.get(NPCInteractionMenuComp).removeChat(e.eid);
    }
}
