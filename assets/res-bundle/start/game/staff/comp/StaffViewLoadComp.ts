import { Prefab, instantiate } from 'cc';
import { app } from '../../../../../app/app';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { StaffModelComp } from './StaffModelComp';
import { UnitStaff } from '../render/UnitStaff';
import { getStaffConfig } from 'db://assets/res-bundle/base/config/StaffConfig';

/**
 * 武器使用组件
 */
@ecs.register('StaffViewLoadComp')
export class StaffViewLoadComp extends ecs.Comp {
    reset(): void {}
}

/**武器使用系统 */
export class StaffViewLoadSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(StaffViewLoadComp, StaffModelComp);
    }

    entityEnter(e: ECSEntity): void {
        let staffId = e.get(StaffModelComp).staffId;
        let config = getStaffConfig(staffId)!;
        app.manager.loader.load({
            path: 'game/staff/render/UnitStaff',
            bundle: 'start',
            type: Prefab,
            onComplete: (result: Prefab | null) => {
                if (!e.get(EnabledComp)) {
                    console.log('实体已经被销毁');
                    return;
                }

                if (!result) {
                    console.log('法杖预制体不存在');
                    return;
                }

                let node = instantiate(result);
                node.getComponent(UnitStaff)!.init({ e: e, id: e.get(StaffModelComp).staffId });
            },
        });
        e.remove(StaffViewLoadComp);
    }
}
