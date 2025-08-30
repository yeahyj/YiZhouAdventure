// 自动生成的配置文件，请勿手动修改

/**
 * RoleConfig 配置表接口
 */
export interface IRoleConfig {
    id: number; // 角色id
    name: string; // 角色名字
    bundle: string; // 包
    path: string; // 路径
    comp: number[]; // 功能
    agentWeight: number; //  避障权重
    maxVelocity: number; //  避障最大速度
    chaseRadius: number; // 追踪半径
    hp: number; // 生命
    hpRecover: number; // 生命恢复
    atk: number; // 攻击
    atkSpeed: number; // 攻击速度
    cdReduce: number; // 冷却缩减
    speed: number; // 速度
    crit: number; // 暴击几率
    critDamage: number; // 暴击伤害
    reflectDamage: number; // 反伤
    staff: number[]; // 魔法杖
    materials: any[]; // 材料
    magicStones: any[]; // 魔法石
    props: any[]; // 道具
    talents: number[]; // 天赋
    extraComp: number[]; // 额外组件
    skill: number[]; // 技能
}

/**
 * RoleConfig 配置表数据
 */
export const DB_RoleConfig: Readonly<Record<string, IRoleConfig>> = {
  '10001': {
    'id': 10001,
    'name': '英雄女',
    'bundle': 'start',
    'path': 'game/role/render/UnitHeroGirl',
    'comp': [],
    'agentWeight': 0.5,
    'maxVelocity': 600,
    'chaseRadius': 500,
    'hp': 10000,
    'hpRecover': 0,
    'atk': 10,
    'atkSpeed': 1,
    'cdReduce': 0,
    'speed': 600,
    'crit': 0,
    'critDamage': 4,
    'reflectDamage': 0,
    'staff': [
      100101
    ],
    'materials': [],
    'magicStones': [],
    'props': [],
    'talents': [],
    'extraComp': [],
    'skill': []
  },
  '11001': {
    'id': 11001,
    'name': '逛街女孩',
    'bundle': 'start',
    'path': 'game/role/render/UnitShoppingGirl',
    'comp': [],
    'agentWeight': 0.5,
    'maxVelocity': 600,
    'chaseRadius': 500,
    'hp': 100,
    'hpRecover': 0,
    'atk': 10,
    'atkSpeed': 1,
    'cdReduce': 0,
    'speed': 600,
    'crit': 0,
    'critDamage': 4,
    'reflectDamage': 0,
    'staff': [
      100101
    ],
    'materials': [],
    'magicStones': [],
    'props': [],
    'talents': [],
    'extraComp': [],
    'skill': []
  },
  '20001': {
    'id': 20001,
    'name': '苍蝇',
    'bundle': 'dungeon',
    'path': 'game/role/render/UnitFly',
    'comp': [],
    'agentWeight': 1,
    'maxVelocity': 300,
    'chaseRadius': 500,
    'hp': 50,
    'hpRecover': 0,
    'atk': 10,
    'atkSpeed': 3,
    'cdReduce': 0,
    'speed': 300,
    'crit': 0,
    'critDamage': 0,
    'reflectDamage': 0,
    'staff': [],
    'materials': [],
    'magicStones': [],
    'props': [],
    'talents': [],
    'extraComp': [],
    'skill': []
  },
  '30001': {
    'id': 30001,
    'name': 'boss苍蝇',
    'bundle': 'dungeon',
    'path': 'game/role/render/UnitFly',
    'comp': [],
    'agentWeight': 1,
    'maxVelocity': 300,
    'chaseRadius': 500,
    'hp': 500,
    'hpRecover': 0,
    'atk': 10,
    'atkSpeed': 3,
    'cdReduce': 0,
    'speed': 300,
    'crit': 0,
    'critDamage': 0,
    'reflectDamage': 0,
    'staff': [],
    'materials': [],
    'magicStones': [],
    'props': [],
    'talents': [],
    'extraComp': [],
    'skill': []
  }
} as const;

/**
 * 获取 RoleConfig 配置项
 * @param id 配置ID
 */
export function getRoleConfig(id: string | number): IRoleConfig | undefined {
    return DB_RoleConfig[String(id)];
}

/**
 * 获取所有 RoleConfig 配置项
 */
export function getAllRoleConfig(): IRoleConfig[] {
    return Object.values(DB_RoleConfig);
}

/**
 * 查找 RoleConfig 配置项
 * @param predicate 查找条件
 */
export function findRoleConfig(predicate: (item: IRoleConfig) => boolean): IRoleConfig | undefined {
    return Object.values(DB_RoleConfig).find(predicate);
}

/**
 * 查找所有匹配的 RoleConfig 配置项
 * @param predicate 查找条件
 */
export function findAllRoleConfig(predicate: (item: IRoleConfig) => boolean): IRoleConfig[] {
    return Object.values(DB_RoleConfig).filter(predicate);
}
