import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { MarkerDisarmStaffComp } from '../../staff/comp/marker/MarkerDisarmStaffComp';
import { MarkerEquipStaffComp } from '../../staff/comp/marker/MarkerEquipStaffComp';
import { StaffAddToUnitViewComp } from '../../staff/comp/StaffAddToUnitViewComp';
import { StaffDropComp } from '../../staff/comp/StaffDropComp';
import { StaffModelComp } from '../../staff/comp/StaffModelComp';
import { StaffEntity } from '../../staff/entity/StaffEntity';
import { EquipStaffComp } from './EquipStaffComp';

/**
 * 角色法杖背包
 */
@ecs.register('StaffBagComp')
export class StaffBagComp extends ecs.Comp {
    /**法杖最大数量 */
    maxNum: number = 3;
    /**当前拥有的法杖 */
    bag: StaffEntity[] = [];
    /**正在使用中的法杖 */
    usingIndex: number = -1;

    getUsingStaff(): StaffEntity {
        return this.bag[this.usingIndex];
    }

    /**放入法杖 */
    putStaff(staff: StaffEntity, index: number) {
        if (index >= this.maxNum) {
            return;
        }
        if (this.bag[index]) {
            this.bag[index].add(StaffDropComp);
        }
        this.bag[index] = staff;
        this.ent.addChild(staff);
    }

    /**放入法杖，根据法杖配置id */
    putStaffById(staffId: number, index: number) {
        let staffEntity = ecs.getEntity<StaffEntity>(StaffEntity);
        staffEntity.get(StaffModelComp).init({ staffId });
        this.putStaff(staffEntity, index);
    }

    useStaff(index: number) {
        if (index == this.usingIndex || !this.bag[index]) {
            return;
        }

        this.disarmStaff(this.usingIndex);

        if (this.bag[index]) {
            this.ent.add(EquipStaffComp, true).useIndex = index;
        }
    }

    equipStaff(index: number) {
        let staff = this.bag[index];
        if (staff) {
            this.ent.addChild(staff);
            staff.add(StaffAddToUnitViewComp);
            staff.add(MarkerEquipStaffComp);
            this.usingIndex = index;
        }
    }

    /**卸下法杖 */
    disarmStaff(index: number) {
        let staff = this.bag[index];
        if (staff) {
            staff.parent!.removeChild(staff);
            staff.remove(StaffAddToUnitViewComp);
            staff.add(MarkerDisarmStaffComp);
            this.usingIndex = -1;
        }
    }

    reset(): void {
        this.maxNum = 3;
        this.bag = [];
        this.usingIndex = -1;
    }
}
