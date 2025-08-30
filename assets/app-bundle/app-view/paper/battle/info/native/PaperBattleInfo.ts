import { Node } from 'cc';
import { _decorator, ProgressBar, Button } from 'cc';
import BaseView from 'db://app/base/BaseView';
import { BattleController } from 'db://assets/app-builtin/app-controller/BattleController';
import { app } from 'db://assets/app/app';
import { getStaffConfig } from 'db://assets/res-bundle/base/config/StaffConfig';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { AttributeType, ItemType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import { GameModelComp } from 'db://assets/res-bundle/start/game/game/comp/GameModelComp';
import { HpComp } from 'db://assets/res-bundle/start/game/role/comp/HpComp';
import { PropBagComp } from 'db://assets/res-bundle/start/game/role/comp/PropBagComp';
import { RoleModelComp } from 'db://assets/res-bundle/start/game/role/comp/RoleModelComp';
import { StaffBagComp } from 'db://assets/res-bundle/start/game/role/comp/StaffBagComp';
import { MpComp } from 'db://assets/res-bundle/start/game/staff/comp/MpComp';
import { StaffModelComp } from 'db://assets/res-bundle/start/game/staff/comp/StaffModelComp';
import { StaffAttributeType } from 'db://assets/res-bundle/start/game/staff/help/StaffEnum';
import { Item } from 'db://assets/res-bundle/start/ui/item/Item';

const { ccclass, property } = _decorator;
@ccclass('PaperBattleInfo')
export class PaperBattleInfo extends BaseView.BindController(BattleController) {
    @property(ProgressBar)
    hpProg: ProgressBar = null!;

    @property(ProgressBar)
    mpProg: ProgressBar = null!;

    @property(ProgressBar)
    cdProg: ProgressBar = null!;

    @property(Node)
    weaponNode: Node = null!;

    @property(Node)
    propNode: Node = null!;

    @property(Node)
    setNode: Node = null!;
    // 初始化的相关逻辑写在这
    onLoad() {
        this.controller.on(BattleController.Event.UpdatePlayerBagUI, this.updatePlayerInfoUI, this);
        this.controller.on(BattleController.Event.UpdatePlayerProgressUI, this.updatePlayerProgress, this);

        this.setNode.on(
            Button.EventType.CLICK,
            () => {
                app.manager.ui.show({ name: 'PopSet', data: { index: 0 } });
            },
            this,
        );
    }

    updatePlayerInfoUI() {
        let staffBag = ecs.getSingleton(GameModelComp).playerEntity.get(StaffBagComp);
        for (let i = 0; i < this.weaponNode.children.length; i++) {
            let item = this.weaponNode.children[i];
            let staff = staffBag.bag[i];
            if (staff) {
                let config = getStaffConfig(staff.get(StaffModelComp).staffId)!;
                item.getComponent(Item)!.init({
                    iconPath: config.resPath,
                    bundle: config.resBundle,
                    type: ItemType.STAFF,
                    click: () => {
                        app.manager.ui.show({
                            name: 'PopSet',
                            data: { index: 1, itemData: i },
                        });
                    },
                });
            } else {
                item.getComponent(Item)!.init({ type: ItemType.STAFF });
            }
        }

        let propBag = ecs.getSingleton(GameModelComp).playerEntity.get(PropBagComp);
        for (let i = 0; i < this.propNode.children.length; i++) {
            let item = this.propNode.children[i];
            let prop = propBag.bag[i];
            if (prop) {
                //TODO: 道具图标
            } else {
                item.getComponent(Item)!.init({ type: ItemType.PROP });
            }
        }
    }

    updatePlayerProgress() {
        this.onRefreshHp();
        this.onRefreshMp();
        this.onRefreshCd();
        this.onRefreshExp();
    }

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) {}

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PaperBattleInfo>({name: 'PaperBattleInfo', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }

    onRefreshHp() {
        let player = ecs.getSingleton(GameModelComp).playerEntity;
        let data = player.get(RoleModelComp);
        this.hpProg.progress =
            player.get(HpComp).currentHp / data.commonAttributes.attributes.getMaxValue(AttributeType.hp);
    }

    onRefreshMp() {
        let player = ecs.getSingleton(GameModelComp).playerEntity;
        let weapon = player.get(StaffBagComp)?.getUsingStaff();
        if (weapon) {
            this.mpProg.progress =
                weapon.get(MpComp).mp / weapon.get(StaffModelComp).attributes[StaffAttributeType.mpMax];
        } else {
            this.mpProg.progress = 0;
        }
    }

    onRefreshCd() {
        let player = ecs.getSingleton(GameModelComp).playerEntity;
        let weapon = player.get(StaffBagComp)?.getUsingStaff();
        if (weapon) {
            let comp = weapon.get(StaffModelComp);
            if (comp) {
                this.cdProg.progress = 1 - comp.castDelay / comp.castMaxDelay;
            }
        } else {
            this.cdProg.progress = 1;
        }
    }

    onRefreshExp() {}
}
