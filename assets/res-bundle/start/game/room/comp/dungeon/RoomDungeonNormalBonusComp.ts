import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { BagType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import { BagItemData } from 'db://assets/res-bundle/start/game/common/help/CommonInterface';
import { RoomEnvironmentModelComp } from 'db://assets/res-bundle/start/game/environment/comp/RoomEnvironmentModelComp';
import { RoomEnvironmentEntity } from 'db://assets/res-bundle/start/game/environment/entity/RoomEnvironmentEntity';
import { TreasureChestType } from 'db://assets/res-bundle/start/game/environment/help/EnvironmentEnum';
import { TreasureChestData } from 'db://assets/res-bundle/start/game/environment/help/EnvironmentInterface';
import { RoomStateClearedComp } from 'db://assets/res-bundle/start/game/room/comp/RoomStateClearedComp';

/**
 * 房间普通奖励
 */
@ecs.register('RoomDungeonNormalBonusComp')
export class RoomDungeonNormalBonusComp extends ecs.Comp {
    reset(): void {}
}

/**房间普通奖励系统 */
export class RoomDungeonNormalBonusSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomDungeonNormalBonusComp, RoomStateClearedComp);
    }

    entityEnter(entity: ECSEntity): void {
        //TODO:优化奖励
        let reward: BagItemData[] = [{ type: BagType.magicStone, id: 100101, num: 1 }];
        let mapElementEntity = ecs.getEntity<RoomEnvironmentEntity>(RoomEnvironmentEntity);
        let environmentData: TreasureChestData = {
            type: TreasureChestType.LOOT,
            data: {
                lv: '1',
                resType: '1',
            },
            id: 0,
            posIndex: 0,
        };
        mapElementEntity.add(RoomEnvironmentModelComp).init({
            environmentData: environmentData,
            extraData: reward,
        });
    }
}
