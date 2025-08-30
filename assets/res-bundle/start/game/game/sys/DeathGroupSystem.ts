import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { DeathBombExplosionSystem } from '../../magic/comp/DeathBombExplosionComp';
import { TriggerDeathSystem } from '../../magic/comp/TriggerDeathComp';
import { DeathRoleSystem } from '../../role/comp/death/DeathRoleComp';
import { DeathSystem } from '../../role/comp/death/DeathComp';
import { DeathAfterSystem } from '../../role/comp/death/DeathAfterComp';
import { DeathBeforeSystem } from '../../role/comp/death/DeathBeforeComp';

/**
 * 死亡组系统
 * 负责死亡的逻辑
 */
export class DeathGroupSystem extends ecs.System {
    constructor() {
        super();

        //死亡前的判断放在BeforeDeathMarkerSystem前
        this.add(new DeathBeforeSystem());
        //死亡后的逻辑放在AfterDeathMarkerSystem后
        this.add(new TriggerDeathSystem());
        this.add(new DeathAfterSystem());
        //死亡的逻辑放在DeathSystem前
        this.add(new DeathBombExplosionSystem());
        this.add(new DeathRoleSystem());
        this.add(new DeathSystem());
    }
}
