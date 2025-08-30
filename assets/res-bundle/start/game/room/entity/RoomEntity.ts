import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseEntity } from '../../common/entity/BaseEntity';
import { IsRoomComp } from '../../common/comp/IsRoomComp';
import { RoomStateComp } from '../comp/RoomStateComp';
import { RoomUnitHierarchyComp } from '../comp/RoomUnitHierarchyComp';
import { RoomGridMoveTypeComp } from '../comp/RoomGridMoveTypeComp';
import { RoomViewLoadComp } from 'db://assets/res-bundle/start/game/room/comp/dungeon/RoomViewLoadComp';
import { ChildRoomNoEnemyComp } from '../comp/ChildRoomNoEnemyComp';
import { RoomCollisionComp } from '../comp/collision/RoomCollisionComp';

/** 房间元素实体 */
@ecs.register('RoomEntity')
export class RoomEntity extends BaseEntity {
    protected init(): void {
        super.init();
        this.addComponents<ecs.Comp>(
            RoomStateComp,
            RoomUnitHierarchyComp,
            IsRoomComp,
            RoomGridMoveTypeComp,
            RoomViewLoadComp,
            ChildRoomNoEnemyComp,
            RoomCollisionComp,
        );
    }
}
