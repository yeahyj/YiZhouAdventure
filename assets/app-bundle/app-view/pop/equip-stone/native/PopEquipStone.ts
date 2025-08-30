import { _decorator } from 'cc';
import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { Node } from 'cc';
import { getStaffConfig } from 'db://assets/res-bundle/base/config/StaffConfig';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BagType, ItemType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import { GameModelComp } from 'db://assets/res-bundle/start/game/game/comp/GameModelComp';
import { StaffBagComp } from 'db://assets/res-bundle/start/game/role/comp/StaffBagComp';
import { StaffModelComp } from 'db://assets/res-bundle/start/game/staff/comp/StaffModelComp';
import { Item } from 'db://assets/res-bundle/start/ui/item/Item';
import { StaffAttributeType } from 'db://assets/res-bundle/start/game/staff/help/StaffEnum';
import { instantiate } from 'cc';
import { Label } from 'cc';
import { StaffAttributeDesc } from 'db://assets/res-bundle/start/game/staff/help/StaffConst';
import { getMagicStonesConfig } from 'db://assets/res-bundle/base/config/MagicStonesConfig';
import { WarehouseComp } from 'db://assets/res-bundle/start/game/role/comp/WarehouseComp';
import { Button } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('PopEquipStone')
export class PopEquipStone extends BaseView {
    @property(Node)
    weaponNode: Node = null!;

    @property(Node)
    attrGroup: Node = null!;

    @property(Node)
    stoneGroup: Node = null!;

    @property(Node)
    warehouseGroup: Node = null!;

    @property(Button)
    closeBtn: Button = null!;

    lastStaffSelectIndex: number = -1;
    lastWarehouseSelectIndex: number = -1;
    lastStoneSelectIndex: number = -1;

    // 初始化的相关逻辑写在这
    onLoad() {
        this.closeBtn.node.on(Button.EventType.CLICK, () => {
            this.hide();
        });
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
                        this.onLookupStaffInfo(i);
                    },
                });
            } else {
                item.getComponent(Item)!.init({ type: ItemType.STAFF });
            }
        }
    }

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(index: number) {
        this.onLookupStaffInfo(index);
    }

    onLookupStaffInfo(index: number) {
        let staffBag = ecs.getSingleton(GameModelComp).playerEntity.get(StaffBagComp);
        let staff = staffBag.bag[index];
        if (staff) {
            if (this.lastStaffSelectIndex != -1) {
                let lastItem = this.weaponNode.children[this.lastStaffSelectIndex];
                lastItem?.getComponent(Item)?.setSelect(false);
            }
            let item = this.weaponNode.children[index];
            item?.getComponent(Item)?.setSelect(true);
            this.lastStaffSelectIndex = index;
            this.updateAttrInfo();
        }
    }

    updateAttrInfo() {
        let staffBag = ecs.getSingleton(GameModelComp).playerEntity.get(StaffBagComp);
        let staff = staffBag.bag[this.lastStaffSelectIndex];
        if (staff) {
            // 遍历所有枚举值
            let index = 0;
            for (const key in StaffAttributeType) {
                const valueName = StaffAttributeType[key as keyof typeof StaffAttributeType];
                let value = staff.get(StaffModelComp).attributes[valueName];
                let item = this.attrGroup.children[index] ?? instantiate(this.attrGroup.children[0]);
                item.getChildByName('key')!.getComponent(Label)!.string = StaffAttributeDesc[valueName] + ': ';
                item.getChildByName('value')!.getComponent(Label)!.string = value.toString();
                index++;
                this.attrGroup.addChild(item);
            }
        }

        let magicStoneMax = staff.get(StaffModelComp).attributes.magicStoneMax;
        for (let i = 0; i < magicStoneMax; i++) {
            let item = this.stoneGroup.children[i] ?? instantiate(this.stoneGroup.children[0]);
            let stone = staff.get(StaffModelComp).stoneArr[i];
            let data = null;
            if (stone) {
                let id = stone.id;
                let config = getMagicStonesConfig(id)!;
                data = {
                    type: ItemType.MAGIC_STONE,
                    iconPath: config.resPath,
                    bundle: config.resBundle,
                    name: config.name,
                    click: () => {
                        //取消这个石头
                        if (this.lastStoneSelectIndex == i) {
                            this.lastStoneSelectIndex = -1;
                            item.getComponent(Item)!.setSelect(false);
                        } else {
                            this.stoneGroup.children[this.lastStoneSelectIndex]?.getComponent(Item)?.setSelect(false);
                            item.getComponent(Item)!.setSelect(true);
                            this.lastStoneSelectIndex = i;
                            this.equipStone();
                        }
                    },
                };
            } else {
                data = {
                    type: ItemType.MAGIC_STONE,
                    name: '装备',
                    click: () => {
                        //装备这个石头
                        if (this.lastStoneSelectIndex == i) {
                            this.lastStoneSelectIndex = -1;
                            item.getComponent(Item)!.setSelect(false);
                        } else {
                            this.stoneGroup.children[this.lastStoneSelectIndex]?.getComponent(Item)?.setSelect(false);
                            item.getComponent(Item)!.setSelect(true);
                            this.lastStoneSelectIndex = i;
                            this.equipStone();
                        }
                    },
                };
            }
            item.getComponent(Item)!.init(data);
            this.stoneGroup.addChild(item);
        }
    }

    updateWarehouseInfo() {
        let warehouseComp = ecs.getSingleton(GameModelComp).playerEntity.get(WarehouseComp);
        let bag = warehouseComp.warehouse.get(BagType.magicStone) || {};
        let index = 0;
        for (const key in bag) {
            let item = this.warehouseGroup.children[index] ?? instantiate(this.warehouseGroup.children[0]);

            if (bag[key]) {
                let config = getMagicStonesConfig(key)!;
                let data = {
                    type: ItemType.MAGIC_STONE,
                    iconPath: config.resPath,
                    bundle: config.resBundle,
                    name: config.name,
                    click: () => {
                        if (this.lastWarehouseSelectIndex == index) {
                            this.lastWarehouseSelectIndex = -1;
                            item.getComponent(Item)!.setSelect(false);
                        } else {
                            this.warehouseGroup.children[this.lastWarehouseSelectIndex]
                                ?.getComponent(Item)
                                ?.setSelect(false);
                            item.getComponent(Item)!.setSelect(true);
                            this.lastWarehouseSelectIndex = index;
                            this.equipStone();
                        }
                    },
                };
                item.getComponent(Item)!.init(data);
                this.warehouseGroup.addChild(item);
            }

            index++;
        }

        let unEquipItem = this.warehouseGroup.children[index] ?? instantiate(this.warehouseGroup.children[0]);
        let unEquipData = {
            type: ItemType.MAGIC_STONE,
            name: '卸下',
            click: () => {
                //卸下这个石头
                if (this.lastWarehouseSelectIndex == index) {
                    this.lastWarehouseSelectIndex = -1;
                    unEquipItem.getComponent(Item)!.setSelect(false);
                } else {
                    this.warehouseGroup.children[this.lastWarehouseSelectIndex]?.getComponent(Item)?.setSelect(false);
                    unEquipItem.getComponent(Item)!.setSelect(true);
                    this.lastWarehouseSelectIndex = index;
                    this.equipStone();
                }
            },
        };
        unEquipItem.getComponent(Item)!.init(unEquipData);
        this.warehouseGroup.addChild(unEquipItem);
    }

    equipStone() {
        if (this.lastWarehouseSelectIndex != -1 && this.lastStoneSelectIndex != -1) {
            let playerEntity = ecs.getSingleton(GameModelComp).playerEntity;
            let warehouseComp = playerEntity.get(WarehouseComp);
            //法杖石头先放回去
            let staffBag = playerEntity.get(StaffBagComp);
            let staff = staffBag.bag[this.lastStaffSelectIndex];
            if (staff) {
                let stone = staff.get(StaffModelComp).stoneArr[this.lastStoneSelectIndex];
                if (stone) {
                    warehouseComp.addProp(BagType.magicStone, stone.id, stone.capacity);
                }
            }

            //仓库石头拿出来
            let warehouse = warehouseComp.warehouse.get(BagType.magicStone) || {};
            let stone = warehouse[this.lastWarehouseSelectIndex];
            if (stone) {
                staff.get(StaffModelComp).stoneArr[this.lastStoneSelectIndex] = {
                    id: stone,
                    capacity: 1,
                };
            }

            this.updateAttrInfo();
            this.updateWarehouseInfo();
        }
    }

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PopEquipStone>({name: 'PopEquipStone', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }
}
