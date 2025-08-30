import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { HpSystem } from '../../role/comp/HpComp';
import { MoveSystem } from '../../role/comp/MoveComp';
import { PositionSystem, WeaponPositionSystem } from '../../role/comp/PositionComp';
import { SpeedSystem } from '../../role/comp/SpeedComp';
import { MpSystem } from '../../staff/comp/MpComp';
import { StaffDirectionSystem } from '../../staff/comp/StaffDirectionComp';
import { AgentSystem } from '../comp/AgentComp';

/**
 * 属性组系统
 * 负责属性最终使用的系统
 */
export class AttributeGroupSystem extends ecs.System {
    constructor() {
        super();

        //---------------速度相关--------------------------------
        this.add(new SpeedSystem());
        // this.add(new SpeedObstacleAvoidanceSystem());//避障没有完善
        this.add(new AgentSystem());
        this.add(new MoveSystem());
        this.add(new PositionSystem());
        this.add(new StaffDirectionSystem()); //法杖方向要在position后
        this.add(new WeaponPositionSystem());

        //---------------hp相关--------------------------------
        this.add(new HpSystem());

        //---------------mp相关--------------------------------
        this.add(new MpSystem());
    }
}
