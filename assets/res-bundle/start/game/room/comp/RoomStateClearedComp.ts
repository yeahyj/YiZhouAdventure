import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseRoomStateComp } from './base/BaseRoomStateComp';

/**
 * 房间清理完成组件
 */
@ecs.register('RoomStateClearedComp')
export class RoomStateClearedComp extends BaseRoomStateComp {
    init(): void {
        this.ent.children.forEach((child) => {
            child.add(RoomStateClearedComp);
        });
    }

    remove(): void {
        this.ent.children.forEach((child) => {
            child.remove(RoomStateClearedComp);
        });
    }

    reset(): void {}
}
