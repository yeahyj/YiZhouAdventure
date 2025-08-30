import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseEntity } from '../../common/entity/BaseEntity';
import { DirectionComp } from '../../role/comp/DirectionComp';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { FactionTypeComp } from '../../role/comp/FactionTypeComp';
import { MoveComp } from '../../role/comp/MoveComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { MagicManagerComp } from '../comp/MagicManagerComp';
import { MagicModelComp } from '../comp/MagicModelComp';
import { IsMagicComp } from '../../common/comp/IsMagicComp';
import { IsSkillComp } from '../../common/comp/IsSkillComp';

/** 魔法实体 */
@ecs.register('MagicEntity')
export class MagicEntity extends BaseEntity {
    protected init(): void {
        super.init();
        this.addComponents<ecs.Comp>(
            MagicManagerComp,
            PositionComp,
            EnabledComp,
            MoveComp,
            FactionTypeComp,
            DirectionComp,
            MagicModelComp,
            IsMagicComp,
            IsSkillComp,
        );
    }
}
