import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { StaffAttributeType } from '../help/StaffEnum';
import { StaffModelComp } from './StaffModelComp';

/**
 * 法杖魔法值数据
 */
@ecs.register('MpComp')
export class MpComp extends ecs.Comp {
    mp: number = 0;

    reset(): void {}
}

/**魔法值检测系统 */
export class MpSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MpComp, StaffModelComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        let data = e.get(StaffModelComp).attributes[StaffAttributeType.mpMax];
        e.get(MpComp).mp = data;
    }

    update(e: ecs.Entity): void {
        let comp = e.get(MpComp);
        let data = e.get(StaffModelComp).attributes;
        //恢复
        comp.mp += data[StaffAttributeType.mpChargeSpeed] * this.dt;
        let maxMp = data[StaffAttributeType.mpMax];
        if (comp.mp > maxMp) {
            comp.mp = maxMp;
        }
    }
}
