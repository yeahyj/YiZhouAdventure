import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { AttributeGroupSystem } from './AttributeGroupSystem';
import { BattleGroupSystem } from './BattleGroupSystem';
import { DeathGroupSystem } from './DeathGroupSystem';
import { EffectGroupSystem } from './EffectGroupSystem';
import { EnvironmentGroupSystem } from './EnvironmentGroupSystem';
import { GameGroupSystem } from './GameGroupSystem';
import { LastGroupSystem } from './LastGroupSystem';
import { MagicGroupSystem } from './MagicGroupSystem';
import { MapGroupSystem } from './MapGroupSystem';
import { RoleGroupSystem } from './RoleGroupSystem';
import { RoomGroupSystem } from './RoomGroupSystem';
import { StaffGroupSystem } from './StaffGroupSystem';
import { VFXGroupSystem } from './VFXGroupSystem';

/**根系统 */
export class RootGroupSystem extends ecs.System {
    constructor() {
        super();

        this.add(new GameGroupSystem());
        this.add(new MapGroupSystem());
        this.add(new RoomGroupSystem());
        this.add(new EnvironmentGroupSystem());
        this.add(new BattleGroupSystem());
        this.add(new RoleGroupSystem());
        this.add(new StaffGroupSystem());
        this.add(new MagicGroupSystem());
        this.add(new EffectGroupSystem());
        this.add(new AttributeGroupSystem());
        this.add(new VFXGroupSystem());
        this.add(new DeathGroupSystem());
        this.add(new LastGroupSystem());
    }
}
