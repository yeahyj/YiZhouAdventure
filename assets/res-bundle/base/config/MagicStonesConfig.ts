// 自动生成的配置文件，请勿手动修改

/**
 * MagicStonesConfig 配置表接口
 */
export interface IMagicStonesConfig {
    id: number; // 技能id
    type: string; // 类型
    influence: string; // 作用
    isCast: boolean; // 占用施法
    capacity: number; // 容量
    extraCast: number; // 额外施法数量
    className: string; // 插件
    extraModifyStone: number[]; // 额外组件
    name: string; // 技能名字
    resourceCost: number[][]; // 资源消耗
    mpCost: number; // 法力消耗
    delayTime: number; // 延迟
    chargeTime: number; // 充能时间
    scatteringAngle: number; // 散射角度
    unlockLv: number; // 解锁等级
    resBundle: string; // 资源包名
    resPath: string; // 资源路径
}

/**
 * MagicStonesConfig 配置表数据
 */
export const DB_MagicStonesConfig: Readonly<Record<string, IMagicStonesConfig>> = {
  '100101': {
    'id': 100101,
    'type': 'projectile',
    'influence': 'projectile',
    'isCast': true,
    'capacity': -1,
    'extraCast': 0,
    'className': 'FireballComp',
    'extraModifyStone': [],
    'name': '火球术',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 0.3,
    'chargeTime': 0.5,
    'scatteringAngle': 10,
    'unlockLv': 1,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/1'
  },
  '100102': {
    'id': 100102,
    'type': 'projectile',
    'influence': 'projectile',
    'isCast': true,
    'capacity': -1,
    'extraCast': 0,
    'className': 'CollisionFireballComp',
    'extraModifyStone': [],
    'name': '碰撞触发火球术',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 0.3,
    'chargeTime': 0.5,
    'scatteringAngle': 10,
    'unlockLv': 10,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/2'
  },
  '100103': {
    'id': 100103,
    'type': 'projectile',
    'influence': 'projectile',
    'isCast': true,
    'capacity': -1,
    'extraCast': 0,
    'className': 'TimingFireballComp',
    'extraModifyStone': [],
    'name': '定时触发火球术',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 0.3,
    'chargeTime': 0.5,
    'scatteringAngle': 10,
    'unlockLv': 10,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/3'
  },
  '100104': {
    'id': 100104,
    'type': 'projectile',
    'influence': 'projectile',
    'isCast': true,
    'capacity': -1,
    'extraCast': 0,
    'className': 'DeathFireballComp',
    'extraModifyStone': [],
    'name': '死亡触发火球术',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 0.3,
    'chargeTime': 0.5,
    'scatteringAngle': 10,
    'unlockLv': 10,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/4'
  },
  '100201': {
    'id': 100201,
    'type': 'projectile',
    'influence': 'projectile',
    'isCast': true,
    'capacity': -1,
    'extraCast': 0,
    'className': 'BombComp',
    'extraModifyStone': [],
    'name': '炸弹',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 0.3,
    'chargeTime': 0.5,
    'scatteringAngle': 10,
    'unlockLv': 5,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/5'
  },
  '100251': {
    'id': 100251,
    'type': 'effect',
    'influence': 'projectile',
    'isCast': false,
    'capacity': -1,
    'extraCast': 0,
    'className': 'BombExplosionComp',
    'extraModifyStone': [],
    'name': '炸弹爆炸效果',
    'resourceCost': [],
    'mpCost': 0,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/6'
  },
  '100252': {
    'id': 100252,
    'type': 'modify',
    'influence': 'modify',
    'isCast': false,
    'capacity': -1,
    'extraCast': 0,
    'className': 'DeathBombExplosionComp',
    'extraModifyStone': [],
    'name': '死亡爆炸',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 1,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/7'
  },
  '100301': {
    'id': 100301,
    'type': 'projectile',
    'influence': 'projectile',
    'isCast': true,
    'capacity': -1,
    'extraCast': 0,
    'className': 'ChainSawComp',
    'extraModifyStone': [],
    'name': '链锯',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 0.3,
    'chargeTime': 0.5,
    'scatteringAngle': 10,
    'unlockLv': 15,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/8'
  },
  '100401': {
    'id': 100401,
    'type': 'projectile',
    'influence': 'projectile',
    'isCast': true,
    'capacity': -1,
    'extraCast': 0,
    'className': 'BlackHoleComp',
    'extraModifyStone': [],
    'name': '黑洞',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 0.3,
    'chargeTime': 0.5,
    'scatteringAngle': 10,
    'unlockLv': 15,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/9'
  },
  '200101': {
    'id': 200101,
    'type': 'modify',
    'influence': 'move',
    'isCast': false,
    'capacity': -1,
    'extraCast': 0,
    'className': 'MagicMoveLinearComp',
    'extraModifyStone': [],
    'name': '直线发射',
    'resourceCost': [],
    'mpCost': 0,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/10'
  },
  '200102': {
    'id': 200102,
    'type': 'modify',
    'influence': 'move',
    'isCast': false,
    'capacity': -1,
    'extraCast': 0,
    'className': 'PursueEnemyMoveComp',
    'extraModifyStone': [],
    'name': '追踪敌人移动',
    'resourceCost': [],
    'mpCost': 0,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/11'
  },
  '200201': {
    'id': 200201,
    'type': 'modify',
    'influence': 'multipleCast',
    'isCast': true,
    'capacity': -1,
    'extraCast': 2,
    'className': 'MagicCastDoubleComp',
    'extraModifyStone': [],
    'name': '双倍释放',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 20,
    'unlockLv': 8,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/12'
  },
  '200301': {
    'id': 200301,
    'type': 'modify',
    'influence': 'trigger',
    'isCast': false,
    'capacity': -1,
    'extraCast': 1,
    'className': 'TriggerCollisionComp',
    'extraModifyStone': [],
    'name': '碰撞触发',
    'resourceCost': [],
    'mpCost': 0,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/13'
  },
  '200302': {
    'id': 200302,
    'type': 'modify',
    'influence': 'trigger',
    'isCast': false,
    'capacity': -1,
    'extraCast': 1,
    'className': 'TriggerTimingComp',
    'extraModifyStone': [],
    'name': '定时触发',
    'resourceCost': [],
    'mpCost': 0,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/14'
  },
  '200303': {
    'id': 200303,
    'type': 'modify',
    'influence': 'trigger',
    'isCast': false,
    'capacity': -1,
    'extraCast': 1,
    'className': 'TriggerDeathComp',
    'extraModifyStone': [],
    'name': '死亡触发',
    'resourceCost': [],
    'mpCost': 0,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/15'
  },
  '200401': {
    'id': 200401,
    'type': 'modify',
    'influence': 'modify',
    'isCast': false,
    'capacity': -1,
    'extraCast': 0,
    'className': 'CollisionReboundComp',
    'extraModifyStone': [],
    'name': '碰撞反弹',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/16'
  },
  '200402': {
    'id': 200402,
    'type': 'modify',
    'influence': 'modify',
    'isCast': false,
    'capacity': -1,
    'extraCast': 0,
    'className': 'CollisionMotionlessComp',
    'extraModifyStone': [],
    'name': '碰撞静止',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/17'
  },
  '200501': {
    'id': 200501,
    'type': 'modify',
    'influence': 'modify',
    'isCast': false,
    'capacity': -1,
    'extraCast': 0,
    'className': 'FlyingHooksComp',
    'extraModifyStone': [],
    'name': '飞爪',
    'resourceCost': [],
    'mpCost': 10,
    'delayTime': 1,
    'chargeTime': 0.1,
    'scatteringAngle': 0,
    'unlockLv': 9999,
    'resBundle': 'start',
    'resPath': 'game/magic/render/res/stone/18'
  }
} as const;

/**
 * 获取 MagicStonesConfig 配置项
 * @param id 配置ID
 */
export function getMagicStonesConfig(id: string | number): IMagicStonesConfig | undefined {
    return DB_MagicStonesConfig[String(id)];
}

/**
 * 获取所有 MagicStonesConfig 配置项
 */
export function getAllMagicStonesConfig(): IMagicStonesConfig[] {
    return Object.values(DB_MagicStonesConfig);
}

/**
 * 查找 MagicStonesConfig 配置项
 * @param predicate 查找条件
 */
export function findMagicStonesConfig(predicate: (item: IMagicStonesConfig) => boolean): IMagicStonesConfig | undefined {
    return Object.values(DB_MagicStonesConfig).find(predicate);
}

/**
 * 查找所有匹配的 MagicStonesConfig 配置项
 * @param predicate 查找条件
 */
export function findAllMagicStonesConfig(predicate: (item: IMagicStonesConfig) => boolean): IMagicStonesConfig[] {
    return Object.values(DB_MagicStonesConfig).filter(predicate);
}
