import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseEntity } from '../../common/entity/BaseEntity';
import { FixedEntPositionComp } from '../../role/comp/FixedEntPositionComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { StaffDirectionComp } from '../comp/StaffDirectionComp';
import { StaffModelComp } from '../comp/StaffModelComp';
import { IsStaffComp } from '../../common/comp/IsStaffComp';
import { StaffViewLoadComp } from '../comp/StaffViewLoadComp';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { MpComp } from '../comp/MpComp';

/** 法杖 */
@ecs.register('StaffEntity')
export class StaffEntity extends BaseEntity {
    protected init(): void {
        super.init();
        this.addComponents<ecs.Comp>(
            StaffModelComp,
            StaffDirectionComp,
            PositionComp,
            IsStaffComp,
            FixedEntPositionComp,
            StaffViewLoadComp,
            EnabledComp,
            MpComp,
        );
    }

    destroy(): void {
        super.destroy();
    }
}
