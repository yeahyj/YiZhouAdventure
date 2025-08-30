// 自动生成的配置文件，请勿手动修改

/**
 * CompConfig 配置表接口
 */
export interface ICompConfig {
    id: number; // 功能id
    className: string; // 名字
    des: string; // 描述
}

/**
 * CompConfig 配置表数据
 */
export const DB_CompConfig: Readonly<Record<string, ICompConfig>> = {
  '100101': {
    'id': 100101,
    'className': 'Enemy1FsmComp',
    'des': '敌人行为树'
  },
  '100201': {
    'id': 100201,
    'className': 'DropPlayerExpComp',
    'des': '掉落玩家经验'
  },
  '100202': {
    'id': 100202,
    'className': 'DropSkillPluginComp',
    'des': '掉落技能插件组件'
  },
  '100203': {
    'id': 100203,
    'className': 'DropWeaponComp',
    'des': '掉落武器组件'
  },
  '100204': {
    'id': 100204,
    'className': 'DropMagicStoneComp',
    'des': '掉落魔法石组件'
  },
  '100205': {
    'id': 100205,
    'className': 'DropMoneyComp',
    'des': '掉落金钱组件'
  },
  '100206': {
    'id': 100206,
    'className': 'DropEquipmentComp',
    'des': '掉落装备组件'
  },
  '100301': {
    'id': 100301,
    'className': 'NotOutBoundsComp',
    'des': '不出边界'
  },
  '200101': {
    'id': 200101,
    'className': 'InfiniteMapCom',
    'des': '无限地图'
  },
  '200102': {
    'id': 200102,
    'className': 'DungeonComp',
    'des': '地牢地图'
  },
  '200103': {
    'id': 200103,
    'className': 'BigMapComp',
    'des': '大地图'
  },
  '300101': {
    'id': 300101,
    'className': 'RandomlyGenerateMonsterComp',
    'des': '随机生成敌人'
  },
  '400101': {
    'id': 400101,
    'className': 'DropTaskExpComp',
    'des': '敌人死亡增加任务经验'
  },
  '500101': {
    'id': 500101,
    'className': 'TaskExpComp',
    'des': '收集精魄任务初始化'
  },
  '500201': {
    'id': 500201,
    'className': 'GenerateOneRoleComp',
    'des': '消灭其他敌人，生成一个boss,消灭一个boss'
  },
  '600101': {
    'id': 600101,
    'className': 'CloseCombatAtkComp',
    'des': '普通近战攻击'
  }
} as const;

/**
 * 获取 CompConfig 配置项
 * @param id 配置ID
 */
export function getCompConfig(id: string | number): ICompConfig | undefined {
    return DB_CompConfig[String(id)];
}

/**
 * 获取所有 CompConfig 配置项
 */
export function getAllCompConfig(): ICompConfig[] {
    return Object.values(DB_CompConfig);
}

/**
 * 查找 CompConfig 配置项
 * @param predicate 查找条件
 */
export function findCompConfig(predicate: (item: ICompConfig) => boolean): ICompConfig | undefined {
    return Object.values(DB_CompConfig).find(predicate);
}

/**
 * 查找所有匹配的 CompConfig 配置项
 * @param predicate 查找条件
 */
export function findAllCompConfig(predicate: (item: ICompConfig) => boolean): ICompConfig[] {
    return Object.values(DB_CompConfig).filter(predicate);
}
