import { ecs } from '../../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../../base/extensions/cc-ecs/ECSEntity';
import { CorrectionAttributeData } from '../../../../common/help/CommonInterface';
import BattleUtil from '../../../../common/help/util/BattleUtil';
import CommonUtil from '../../../../common/help/util/CommonUtil';
import { PositionComp } from '../../PositionComp';
import { TiledMoveComp } from '../../TiledMoveComp';
import { AiRandMpCastMagicComp } from './AiRandMpCastMagicComp';

/**购物女孩 */
@ecs.register('AiShoppingGirlComp')
export class AiShoppingGirlComp extends ecs.Comp {
    //移动时间
    moveTime: number = 0;
    reset(): void {
        this.moveTime = 0;
    }
}

/**购物女孩系统 */
export class AiShoppingGirlSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.ISystemUpdate, ecs.IEntityEnterSystem
{
    correctionAttributeData: Map<number, { [id: string]: CorrectionAttributeData }> = new Map();

    filter(): ecs.IMatcher {
        return ecs.allOf(AiShoppingGirlComp);
    }

    entityEnter(e: ECSEntity): void {
        e.add(TiledMoveComp);
        e.add(AiRandMpCastMagicComp);
    }

    update(e: ECSEntity): void {
        if (e.get(AiShoppingGirlComp).moveTime <= 0) {
            let randStep = CommonUtil.randomBetween(4, 8);
            let endPos = BattleUtil.getRandomMoveEndPos(e.get(PositionComp).getPosition(), randStep);
            e.get(TiledMoveComp).setMoveTarget(endPos);
            e.get(AiShoppingGirlComp).moveTime = e.get(TiledMoveComp).movePath.length + 5;
        }
        e.get(AiShoppingGirlComp).moveTime -= this.dt;
    }
}
