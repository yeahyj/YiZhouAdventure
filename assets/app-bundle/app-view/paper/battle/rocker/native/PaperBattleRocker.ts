import { _decorator, Node, Vec3 } from 'cc';
import BaseView from '../../../../../../../extensions/app/assets/base/BaseView';
import { RockerEventType } from '../../../../../../pkg-export/@gamex/cc-ctrl-rocker';
import { DirectionComp } from '../../../../../../res-bundle/start/game/role/comp/DirectionComp';
import { StaffCastComp } from '../../../../../../res-bundle/start/game/magic/comp/StaffCastComp';
import { StaffDirectionComp } from '../../../../../../res-bundle/start/game/staff/comp/StaffDirectionComp';
import { StaffBagComp } from '../../../../../../res-bundle/start/game/role/comp/StaffBagComp';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { DirectionWeight } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import { GameModelComp } from 'db://assets/res-bundle/start/game/game/comp/GameModelComp';
const { ccclass, property } = _decorator;
@ccclass('PaperBattleRocker')
export class PaperBattleRocker extends BaseView {
    @property(Node)
    moveNode: Node = null!;

    @property(Node)
    atkNode: Node = null!;

    private movePos: Vec3 = null!;
    private moveLong: number = 0;

    private atkPos: Vec3 = null!;
    private atkLong: number = 0;

    // 初始化的相关逻辑写在这
    onLoad() {
        this.moveNode.on(RockerEventType.Change, this.onMoveChange, this);
        this.moveNode.on(RockerEventType.Stop, this.onMoveChange, this);
        this.atkNode.on(RockerEventType.Change, this.onAtkRockerChange, this);
        this.atkNode.on(RockerEventType.Stop, this.onAtkRockerChange, this);
    }

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) {}

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PaperBattleRocker>({name: 'PaperBattleRocker', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }

    onMoveChange(pos: Vec3, long: number) {
        this.movePos = pos;
        this.moveLong = long;
    }

    onAtkRockerChange(pos: Vec3, long: number) {
        this.atkPos = pos;
        this.atkLong = long;
    }

    protected update(dt: number): void {
        this.movePos = this.movePos ?? new Vec3(0, 0, 0);
        this.moveLong = this.moveLong ?? 0;
        let player = ecs.getSingleton(GameModelComp).playerEntity;
        if (!player) {
            return;
        }
        player
            .get(DirectionComp)
            .setDirection({ dir: this.movePos.multiplyScalar(this.moveLong), weight: DirectionWeight.rocker });

        if (this.atkPos) {
            let weapon = player.get(StaffBagComp)?.getUsingStaff();
            if (weapon) {
                let dirComp = weapon.get(StaffDirectionComp);
                dirComp.direction = this.atkPos;
            }
        }
        if (this.atkLong >= 1) {
            if (!player.get(StaffCastComp)) {
                player.add(StaffCastComp);
            }
        } else {
            if (player.get(StaffCastComp)) {
                player.remove(StaffCastComp);
            }
        }
    }
}
