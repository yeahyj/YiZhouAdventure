import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ChildRoomNoEnemySystem } from '../../room/comp/ChildRoomNoEnemyComp';
import { AddGridMoveTypeSystem } from '../../environment/comp/AddGridMoveTypeComp';
import { DoorNormalOpenSystem } from '../../environment/comp/DoorNormalOpenComp';
import { CheckPlayerEnterGirdSystem } from '../../environment/comp/CheckPlayerEnterGirdComp';
import { EnterRoomSystem } from '../../role/comp/EnterRoomComp';
import { RoomCollisionSystem } from '../../room/comp/collision/RoomCollisionComp';

/**房间组系统 */
export class RoomGroupSystem extends ecs.System {
    constructor() {
        super();

        //进入
        this.add(new EnterRoomSystem());

        //障碍
        this.add(new AddGridMoveTypeSystem());

        //房间
        this.add(new ChildRoomNoEnemySystem());
        this.add(new DoorNormalOpenSystem());

        //进入
        this.add(new CheckPlayerEnterGirdSystem());

        //碰撞
        this.add(new RoomCollisionSystem());
    }
}
