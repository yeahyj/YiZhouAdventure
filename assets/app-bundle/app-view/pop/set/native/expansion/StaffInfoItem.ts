import { _decorator } from 'cc';
import { ListView } from '../../../../../../pkg-export/@colayue/cc-comp-list-view';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { GameModelComp } from 'db://assets/res-bundle/start/game/game/comp/GameModelComp';
import { StaffBagComp } from 'db://assets/res-bundle/start/game/role/comp/StaffBagComp';
import { StaffModelComp } from 'db://assets/res-bundle/start/game/staff/comp/StaffModelComp';
import { StaffAttributeType } from 'db://assets/res-bundle/start/game/staff/help/StaffEnum';
import { Node } from 'cc';
import { ItemType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import { WarehouseComp } from 'db://assets/res-bundle/start/game/role/comp/WarehouseComp';
import { Item } from 'db://assets/res-bundle/start/ui/item/Item';
import { getStaffConfig } from 'db://assets/res-bundle/base/config/StaffConfig';
import { Label } from 'cc';
import { StaffAttributeDesc } from 'db://assets/res-bundle/start/game/staff/help/StaffConst';
import { getMagicStonesConfig } from 'db://assets/res-bundle/base/config/MagicStonesConfig';
import { BaseSetItem } from './BaseSetItem';

const { ccclass, property } = _decorator;

@ccclass('StaffInfoItem')
export class StaffInfoItem extends BaseSetItem {
    @property(ListView)
    attributeList: ListView = null!;

    @property(Node)
    staffLayoutNode: Node = null!;

    @property(ListView)
    staffStoneNode: ListView = null!;

    @property(ListView)
    warehouseNode: ListView = null!;

    showAttributes: StaffAttributeType[] = [];
    lastStaffSelectIndex: number = -1;
    lastWarehouseSelectIndex: number = -1;
    lastStoneSelectIndex: number = -1;
    protected onLoad(): void {
        this.showAttributes = [
            StaffAttributeType.isDisorder,
            StaffAttributeType.castNum,
            StaffAttributeType.castDelay,
            StaffAttributeType.chargeTime,
            StaffAttributeType.mpMax,
            StaffAttributeType.mpChargeSpeed,
            StaffAttributeType.capacity,
            StaffAttributeType.scatter,
        ];

        this.initStaff();
        this.updateWarehouseUI();
    }

    show(data: { staffIndex: number }) {
        if (data) {
            this.lastStaffSelectIndex = data.staffIndex;
        }

        if (this.lastStaffSelectIndex == -1) {
            //判断第几个有法杖
            let staffBag = ecs.getSingleton(GameModelComp).playerEntity.get(StaffBagComp).bag;
            for (let i = 0; i < staffBag.length; i++) {
                if (staffBag[i]) {
                    this.lastStaffSelectIndex = i;
                    break;
                }
            }
        }

        if (this.lastStaffSelectIndex != -1) {
            this.onSelectStaff(this.lastStaffSelectIndex);
        }
    }

    initStaff() {
        let staffBag = ecs.getSingleton(GameModelComp).playerEntity.get(StaffBagComp).bag;
        for (let i = 0; i < this.staffLayoutNode.children.length; i++) {
            let staff = staffBag[i];
            if (staff) {
                let config = getStaffConfig(staff.get(StaffModelComp).staffId)!;
                let item = this.staffLayoutNode.children[i]!;
                item.getComponent(Item)!.init({
                    iconPath: config.resPath,
                    bundle: config.resBundle,
                    name: config.name,
                    type: ItemType.STAFF,
                    click: () => {
                        if (staff) {
                            this.onSelectStaff(i);
                        }
                    },
                });
            } else {
                this.staffLayoutNode.children[i]!.getComponent(Item)!.init({
                    type: ItemType.STAFF,
                });
            }
        }
    }

    onSelectStaff(index: number) {
        if (this.lastStaffSelectIndex != -1) {
            this.staffLayoutNode.children[this.lastStaffSelectIndex]!.getComponent(Item)!.setSelect(false);
        }
        this.staffLayoutNode.children[index]!.getComponent(Item)!.setSelect(true);
        this.lastStaffSelectIndex = index;
        this.lastStoneSelectIndex = -1;
        this.updateStaffUI();
    }

    updateStaffUI() {
        this.updateStaffInfoUI();
        this.updateStaffStoneInfo();
    }

    updateStaffInfoUI() {
        this.attributeList.count = this.showAttributes.length;
    }

    updateStaffStoneInfo() {
        let staff = ecs.getSingleton(GameModelComp).playerEntity.get(StaffBagComp).bag[this.lastStaffSelectIndex];
        let attributes = staff.get(StaffModelComp).attributes;
        this.staffStoneNode.count = attributes[StaffAttributeType.magicStoneMax];
    }

    updateWarehouseUI() {
        let warehouseComp = ecs.getSingleton(GameModelComp).playerEntity.get(WarehouseComp);
        let stoneBag = warehouseComp.warehouse.get(ItemType.MAGIC_STONE);
        let count = stoneBag ? Object.keys(stoneBag).length : 0;
        this.warehouseNode.count = count + 1;
    }

    onAttributeRenderEvent(node: Node, index: number) {
        let staffBag = ecs.getSingleton(GameModelComp).playerEntity.get(StaffBagComp).bag;
        let staff = staffBag[this.lastStaffSelectIndex];
        let attributes = staff.get(StaffModelComp).attributes;
        let attribute = this.showAttributes[index];
        let attributeData = attributes[attribute];
        node.getChildByName('name')!.getComponent(Label)!.string = StaffAttributeDesc[attribute];
        let value = null;
        if (typeof attributeData === 'boolean') {
            value = attributeData ? '是' : '否';
        } else {
            value = attributeData.toString();
        }
        node.getChildByName('value')!.getComponent(Label)!.string = value;
    }

    onStoneRenderEvent(node: Node, index: number) {
        let useStaff = ecs.getSingleton(GameModelComp).playerEntity.get(StaffBagComp);
        let staff = useStaff.getUsingStaff();
        let stoneArr = staff.get(StaffModelComp).attributes[StaffAttributeType.magicStones];
        let stone = stoneArr[index];

        if (stone) {
            let config = getMagicStonesConfig(stone.id)!;

            node.getComponent(Item)!.init({
                iconPath: config.resPath,
                bundle: config.resBundle,
                name: config.name,
                type: ItemType.MAGIC_STONE,
                isSelect: index == this.lastStoneSelectIndex,
                click: () => {
                    if (this.lastStoneSelectIndex != -1) {
                        this.staffStoneNode.content.children[this.lastStoneSelectIndex]!.getComponent(Item)!.setSelect(
                            false,
                        );
                    }
                    this.lastStoneSelectIndex = index;
                    node.getComponent(Item)!.setSelect(true);

                    this.equipStone();
                },
            });
        } else {
            node.getComponent(Item)!.init({
                type: ItemType.MAGIC_STONE,
                isSelect: index == this.lastStoneSelectIndex,
                click: () => {
                    if (this.lastStoneSelectIndex != -1) {
                        this.staffStoneNode.content.children[this.lastStoneSelectIndex]!.getComponent(Item)!.setSelect(
                            false,
                        );
                    }
                    this.lastStoneSelectIndex = index;
                    node.getComponent(Item)!.setSelect(true);

                    this.equipStone();
                },
            });
        }
    }

    onWarehouseRenderEvent(node: Node, index: number) {
        if (index == 0) {
            node.getComponent(Item)!.init({
                name: '卸下',
                type: ItemType.MAGIC_STONE,
                isSelect: false,
                click: () => {
                    if (this.lastWarehouseSelectIndex != -1) {
                        this.warehouseNode
                            .getItemByListId(this.lastWarehouseSelectIndex)!
                            .getComponent(Item)!
                            .setSelect(false);
                    }
                    this.lastWarehouseSelectIndex = index;
                    node.getComponent(Item)!.setSelect(true);

                    this.equipStone();
                },
            });
            return;
        } else {
            let warehouseComp = ecs.getSingleton(GameModelComp).playerEntity.get(WarehouseComp);
            let stoneBag = warehouseComp.warehouse.get(ItemType.MAGIC_STONE) ?? [];
            let stone = stoneBag[index - 1];
            if (stone) {
                let stoneId = stone!.id;
                let stoneConfig = getMagicStonesConfig(stoneId)!;
                let path = undefined;
                let bundle = undefined;
                let name = undefined;
                if (stone) {
                    path = stoneConfig.resPath;
                    bundle = stoneConfig.resBundle;
                    name = stoneConfig.name;
                }
                node.getComponent(Item)!.init({
                    iconPath: path,
                    bundle: bundle,
                    name: name,
                    type: ItemType.MAGIC_STONE,
                    isSelect: false,
                    click: () => {
                        if (this.lastWarehouseSelectIndex != -1) {
                            this.warehouseNode
                                .getItemByListId(this.lastWarehouseSelectIndex)!
                                .getComponent(Item)!
                                .setSelect(false);
                        }
                        this.warehouseNode.getItemByListId(index)!.getComponent(Item)!.setSelect(true);
                        this.lastWarehouseSelectIndex = index;

                        this.equipStone();
                    },
                });
            } else {
                node.getComponent(Item)!.init({
                    type: ItemType.MAGIC_STONE,
                    isSelect: false,
                    click: () => {
                        if (this.lastWarehouseSelectIndex != -1) {
                            this.warehouseNode
                                .getItemByListId(this.lastWarehouseSelectIndex)!
                                .getComponent(Item)!
                                .setSelect(false);
                        }
                        this.warehouseNode.getItemByListId(index)!.getComponent(Item)!.setSelect(true);
                        this.lastWarehouseSelectIndex = index;

                        this.equipStone();
                    },
                });
            }
        }
    }

    equipStone() {
        if (this.lastWarehouseSelectIndex != -1 && this.lastStoneSelectIndex != -1) {
            let playerEntity = ecs.getSingleton(GameModelComp).playerEntity;
            let warehouseComp = playerEntity.get(WarehouseComp);
            //法杖石头先放回去
            let staffBag = playerEntity.get(StaffBagComp);
            let staff = staffBag.bag[this.lastStaffSelectIndex];
            if (staff) {
                let stoneArr = staff.get(StaffModelComp).attributes[StaffAttributeType.magicStones];
                let stone = stoneArr[this.lastStoneSelectIndex];
                if (stone) {
                    warehouseComp.addProp(ItemType.MAGIC_STONE, stone.id, stone.capacity);
                    stoneArr[this.lastStoneSelectIndex] = null;
                    staff.get(StaffModelComp).attributes = {
                        ...staff.get(StaffModelComp).attributes,
                        [StaffAttributeType.magicStones]: stoneArr,
                    };
                }
            }

            //仓库石头拿出来
            let realLastWarehouseSelectIndex = this.lastWarehouseSelectIndex - 1;
            let warehouse = warehouseComp.warehouse.get(ItemType.MAGIC_STONE) || [];
            let stone = warehouse[realLastWarehouseSelectIndex];
            if (stone) {
                let stoneId = stone?.id;
                staff.get(StaffModelComp).attributes[StaffAttributeType.magicStones][this.lastStoneSelectIndex] = {
                    id: +stoneId,
                    capacity: 1,
                };
                warehouseComp.removeProp(ItemType.MAGIC_STONE, realLastWarehouseSelectIndex);
            }

            this.lastWarehouseSelectIndex = -1;
            this.updateStaffUI();
            this.updateWarehouseUI();
        }
    }
}
