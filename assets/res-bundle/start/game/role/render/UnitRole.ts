import { _decorator } from 'cc';
import { Node } from 'cc';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { UnitStaffLayerComp } from '../comp/UnitStaffLayerComp';
import { getRoleConfig } from '../../../../base/config/RoleConfig';
import { CollisionAtkDetectorComp } from '../comp/CollisionAtkDetectorComp';
import { CollisionBodyComp } from '../comp/CollisionBodyComp';
import { RoleAnimationStateMachineComp } from '../comp/state/RoleAnimationStateMachineComp';

const { ccclass, property } = _decorator;

/**
 *  基础单位
 */
export class UnitRole extends BaseUnit {
    @property(Node)
    public staff: Node = null!;

    initCustom(): void {
        let e = this.ent;
        let id = this.id;

        this.ent = e;
        this.id = id;

        let config = getRoleConfig(id!)!;
        let atkDetector = this.getComponent(CollisionAtkDetectorComp);
        if (atkDetector) {
            atkDetector.initCollision(config.chaseRadius);
            e.add(atkDetector);
        }
        let atk = this.getComponent(CollisionBodyComp);
        if (atk) {
            e.add(atk);
        }

        // //TODO:避障没有完善
        // let foot = this.getComponent(CollisionFootComp);
        // if (foot) {
        //     foot.initCollision(config.maxVelocity);
        //     e.add(foot);
        //     // e.add(SpeedObstacleAvoidanceComp);
        // }

        let staffLayer = this.staff.getComponent(UnitStaffLayerComp);
        if (staffLayer) {
            e.add(staffLayer);
        }

        this.ent.add(RoleAnimationStateMachineComp);
    }
}
