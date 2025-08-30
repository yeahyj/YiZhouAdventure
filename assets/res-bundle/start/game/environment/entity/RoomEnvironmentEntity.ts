import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { IsRoomEnvironmentComp } from '../../common/comp/IsRoomEnvironmentComp';
import { BaseEntity } from '../../common/entity/BaseEntity';
import { CollisionComp } from '../../role/comp/CollisionComp';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { FactionTypeComp } from '../../role/comp/FactionTypeComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { RoomEnvironmentViewLoadComp } from '../comp/RoomEnvironmentViewLoadComp';

/** 房间元素实体 */
@ecs.register('RoomEnvironmentEntity')
export class RoomEnvironmentEntity extends BaseEntity {
    protected init(): void {
        super.init();
        this.addComponents<ecs.Comp>(
            PositionComp,
            EnabledComp,
            FactionTypeComp,
            CollisionComp,
            RoomEnvironmentViewLoadComp,
            IsRoomEnvironmentComp,
        );
    }
}
