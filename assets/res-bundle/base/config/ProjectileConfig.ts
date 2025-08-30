// 自动生成的配置文件，请勿手动修改

/**
 * ProjectileConfig 配置表接口
 */
export interface IProjectileConfig {
    id: number; // 投射物id
    className: string; // 插件
    name: string; // 技能名字
    extraModifyStone: number[]; // 额外组件
    path: string; // 路径
    bundle: string; // 包
    damage: number; // 伤害
    atkMultiple: number; // 攻击倍数
    speed: number; // 速度
    lifeTime: number; // 存在时间
    maxLifeTime: number; // 最大存在时间
    hp: number; // 穿透
    collisionInterval: number; // 碰撞时间间隔
    crit: number; // 暴击几率
    critDamage: number; // 暴击伤害
}

/**
 * ProjectileConfig 配置表数据
 */
export const DB_ProjectileConfig: Readonly<Record<string, IProjectileConfig>> = {
  '100101': {
    'id': 100101,
    'className': 'FireballComp',
    'name': '火球术',
    'extraModifyStone': [
      200101
    ],
    'path': 'game/magic/render/projectile/fireball/Fireball',
    'bundle': 'start',
    'damage': 0,
    'atkMultiple': 1,
    'speed': 500,
    'lifeTime': 1,
    'maxLifeTime': 10,
    'hp': 1,
    'collisionInterval': 999,
    'crit': 0.1,
    'critDamage': 2
  },
  '100201': {
    'id': 100201,
    'className': 'BombComp',
    'name': '炸弹',
    'extraModifyStone': [],
    'path': '',
    'bundle': 'start',
    'damage': 0,
    'atkMultiple': 1,
    'speed': 500,
    'lifeTime': 1,
    'maxLifeTime': 10,
    'hp': 1,
    'collisionInterval': 999,
    'crit': 0.1,
    'critDamage': 2
  },
  '100251': {
    'id': 100251,
    'className': 'BombExplosionComp',
    'name': '炸弹爆炸效果',
    'extraModifyStone': [],
    'path': '',
    'bundle': 'start',
    'damage': 0,
    'atkMultiple': 0,
    'speed': 0,
    'lifeTime': 5,
    'maxLifeTime': 0,
    'hp': 1,
    'collisionInterval': 999,
    'crit': 0.1,
    'critDamage': 2
  },
  '100301': {
    'id': 100301,
    'className': 'ChainSawComp',
    'name': '链锯',
    'extraModifyStone': [
      200101
    ],
    'path': 'game/magic/render/projectile/chainSaw/ChainSaw',
    'bundle': 'start',
    'damage': 0,
    'atkMultiple': 1,
    'speed': 500,
    'lifeTime': 5,
    'maxLifeTime': 10,
    'hp': 999,
    'collisionInterval': 0.2,
    'crit': 0.1,
    'critDamage': 2
  },
  '100401': {
    'id': 100401,
    'className': 'BlackHoleComp',
    'name': '黑洞',
    'extraModifyStone': [
      200101
    ],
    'path': '',
    'bundle': 'start',
    'damage': 0,
    'atkMultiple': 0,
    'speed': 100,
    'lifeTime': 5,
    'maxLifeTime': 10,
    'hp': 999,
    'collisionInterval': 999,
    'crit': 0.1,
    'critDamage': 2
  }
} as const;

/**
 * 获取 ProjectileConfig 配置项
 * @param id 配置ID
 */
export function getProjectileConfig(id: string | number): IProjectileConfig | undefined {
    return DB_ProjectileConfig[String(id)];
}

/**
 * 获取所有 ProjectileConfig 配置项
 */
export function getAllProjectileConfig(): IProjectileConfig[] {
    return Object.values(DB_ProjectileConfig);
}

/**
 * 查找 ProjectileConfig 配置项
 * @param predicate 查找条件
 */
export function findProjectileConfig(predicate: (item: IProjectileConfig) => boolean): IProjectileConfig | undefined {
    return Object.values(DB_ProjectileConfig).find(predicate);
}

/**
 * 查找所有匹配的 ProjectileConfig 配置项
 * @param predicate 查找条件
 */
export function findAllProjectileConfig(predicate: (item: IProjectileConfig) => boolean): IProjectileConfig[] {
    return Object.values(DB_ProjectileConfig).filter(predicate);
}
