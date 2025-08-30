import { js } from 'cc';
import { getCompConfig } from 'db://assets/res-bundle/base/config/CompConfig';
import { getRoleConfig } from 'db://assets/res-bundle/base/config/RoleConfig';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { AttributeType, ItemType } from '../../common/help/CommonEnum';
import { CommonAttributeData } from '../../common/help/CommonInterface';
import { IRoomRole } from '../../room/help/RoomInterface';
import { RoleAttributeData } from '../help/RoleInterface';
import { CommonAttributeComp } from './CommonAttributeComp';
import { HpComp } from './HpComp';
import { RoleAttributeComp } from './RoleAttributeComp';
import { StaffBagComp } from './StaffBagComp';
import { WarehouseComp } from './WarehouseComp';
import { PropBagComp } from './PropBagComp';
import { FactionTypeComp } from './FactionTypeComp';

/**
 * 角色数据
 */
@ecs.register('RoleModelComp')
export class RoleModelComp extends ecs.Comp {
    /**角色id */
    roleId: number = null!;
    /**初始数据 */
    initData: IRoomRole = null!;
    /**公共属性 */
    commonAttributes: CommonAttributeComp = null!;
    /** 角色属性 */
    roleAttributes: RoleAttributeComp = null!;
    /**仓库 */
    warehouse: WarehouseComp = null!;
    /**法杖袋 */
    staffBag: StaffBagComp = null!;
    /**道具袋 */
    propBag: PropBagComp = null!;

    /**
     * 初始化角色数据
     * @param roleId 角色id
     */
    init(data: { roleData: IRoomRole }) {
        this.initData = data.roleData;
        this.warehouse = this.ent.add(WarehouseComp);
        this.commonAttributes = this.ent.add(CommonAttributeComp);
        this.roleAttributes = this.ent.add(RoleAttributeComp);
        this.staffBag = this.ent.add(StaffBagComp);
        this.propBag = this.ent.add(PropBagComp);

        this.roleId = data.roleData.id;
        let config = getRoleConfig(this.roleId)!;

        this.initAttributes();
        //角色额外功能
        if (config.comp) {
            for (let i = 0; i < config.comp.length; i++) {
                let func = config.comp[i];
                let compConfig = getCompConfig(func);
                if (compConfig) {
                    let comp = js.getClassByName(compConfig.className);
                    this.ent.add(comp as any);
                } else {
                    console.error(`角色${this.roleId}的组件${func}不存在`);
                }
            }
        }
        //材料
        if (config.materials) {
            let materials = config.materials;
            for (let i = 0; i < materials.length; i++) {
                let material = materials[i];
                this.warehouse.addProp(ItemType.MATERIAL, material.id, material.num);
            }
        }
        //魔法石
        if (config.magicStones) {
            let magicStones = config.magicStones;
            for (let i = 0; i < magicStones.length; i++) {
                let magicStone = magicStones[i];
                this.warehouse.addProp(ItemType.MAGIC_STONE, magicStone.id, magicStone.num);
            }
        }
        //道具
        if (config.props) {
            let props = config.props;
            for (let i = 0; i < props.length; i++) {
                let prop = props[i];
                this.warehouse.addProp(ItemType.PROP, prop.id, prop.num);
            }
        }

        //武器
        if (config.staff.length > 0) {
            for (let i = 0; i < config.staff.length; i++) {
                let staffId = config.staff[i];
                this.staffBag.putStaffById(staffId, i);
            }
            this.staffBag.useStaff(0);
        }

        for (let i = 0; i < data.roleData.extraComp.length; i++) {
            let extraComp = data.roleData.extraComp[i];
            let comp = this.ent.add(extraComp.comp) as any;
            if (comp.init && extraComp.data) {
                comp.init(extraComp.data);
            }
        }

        this.ent.get(FactionTypeComp).faction = this.initData.faction;
    }

    initAttributes() {
        let config = getRoleConfig(this.roleId)!;
        //角色属性
        let commonAttributeData: CommonAttributeData = {
            [AttributeType.hp]: config.hp,
            [AttributeType.hpRecover]: config.hpRecover,
            [AttributeType.atk]: config.atk,
            [AttributeType.speed]: config.speed,
            [AttributeType.crit]: config.crit,
            [AttributeType.critDamage]: config.critDamage,
            [AttributeType.reflectDamage]: 0,
        };
        this.commonAttributes.init(commonAttributeData);

        let attributeData: RoleAttributeData = {
            [AttributeType.cdReduce]: config.cdReduce,
            [AttributeType.maxVelocity]: config.maxVelocity,
            [AttributeType.agentWeight]: config.agentWeight,
            [AttributeType.maxUseStaffNum]: 1,
            [AttributeType.atkSpeed]: 0,
        };

        this.roleAttributes.init(attributeData);

        this.ent.get(HpComp).init(commonAttributeData[AttributeType.hp]);
    }

    reset(): void {}
}
