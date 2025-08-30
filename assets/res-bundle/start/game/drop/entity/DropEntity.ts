import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseEntity } from '../../common/entity/BaseEntity';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { FactionTypeComp } from '../../role/comp/FactionTypeComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { DropModelComp } from '../comp/DropModelComp';
import { DropViewComp } from '../comp/DropViewComp';
import { DirectionComp } from '../../role/comp/DirectionComp';
import { IsDropComp } from '../comp/IsDropComp';

/** 掉落物实体 */
@ecs.register('DropEntity')
export class DropEntity extends BaseEntity {
    protected init(): void {
        super.init();
        this.addComponents<ecs.Comp>(
            PositionComp,
            EnabledComp,
            FactionTypeComp,
            DropModelComp,
            DropViewComp,
            DirectionComp,
            IsDropComp,
        );
    }
}
