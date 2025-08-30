import { _decorator } from 'cc';
import { BaseEnvironment } from '../../comp/base/BaseEnvironment';
import { GridMoveType } from '../../../room/help/RoomEnum';
import { AddGridMoveTypeComp } from '../../comp/AddGridMoveTypeComp';
import { CollisionBodyComp } from '../../../role/comp/CollisionBodyComp';
const { ccclass, property } = _decorator;

@ccclass('Box')
export class Box extends BaseEnvironment {
    initCustom(): void {
        this.ent.add(AddGridMoveTypeComp).init(GridMoveType.FLY);
        this.ent.add(this.getComponent(CollisionBodyComp)!);
    }
}
