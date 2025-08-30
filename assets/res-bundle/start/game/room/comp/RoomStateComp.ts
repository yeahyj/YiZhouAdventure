import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { CompCtor } from '../../../../base/extensions/cc-ecs/ECSModel';
import { BaseRoomStateComp } from './base/BaseRoomStateComp';

/**
 * 房间状态组件
 */
@ecs.register('RoomStateComp')
export class RoomStateComp extends ecs.Comp {
    //当前状态组件
    currentState: BaseRoomStateComp | null = null;
    //当前状态组件的构造函数
    currentStateCtor: CompCtor<BaseRoomStateComp> | null = null;

    changeState(state: CompCtor<BaseRoomStateComp>): void {
        if (!this.ent.has(state)) {
            if (this.currentState) {
                this.currentState.remove();
                this.ent.remove(this.currentStateCtor!);
            }
            this.ent.add(state).init();
            this.currentState = this.ent.get(state);
            this.currentStateCtor = state;
        }
    }

    reset(): void {
        this.currentState = null;
        this.currentStateCtor = null;
    }
}
