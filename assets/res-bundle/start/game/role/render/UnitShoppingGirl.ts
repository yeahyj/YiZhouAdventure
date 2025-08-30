import { _decorator } from 'cc';
import { UnitRole } from './UnitRole';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { AiShoppingGirlComp } from '../comp/state/ai/AiShoppingGirlComp';

const { ccclass, property } = _decorator;

/**
 *  购物女孩
 */
@ccclass('UnitShoppingGirl')
export class UnitShoppingGirl extends UnitRole {
    init(data: { e: ecs.Entity; id?: number }): void {
        super.init(data);
        data.e.add(AiShoppingGirlComp);
    }
}
