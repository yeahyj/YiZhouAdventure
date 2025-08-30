import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { StaffCastSystem } from '../../magic/comp/StaffCastComp';
import { StaffAddToUnitViewSystem } from '../../staff/comp/StaffAddToUnitViewComp';
import { StaffViewLoadSystem } from '../../staff/comp/StaffViewLoadComp';
import { StaffModelSystem } from '../../staff/comp/StaffModelComp';

/**单位系统 */
export class StaffGroupSystem extends ecs.System {
    constructor() {
        super();

        this.add(new StaffModelSystem());
        this.add(new StaffCastSystem());
        this.add(new StaffViewLoadSystem());
        this.add(new StaffAddToUnitViewSystem());
    }
}
