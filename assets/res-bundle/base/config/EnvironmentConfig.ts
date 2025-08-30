// 自动生成的配置文件，请勿手动修改

/**
 * EnvironmentConfig 配置表接口
 */
export interface IEnvironmentConfig {
    id: number; // 环境id
    name: string; // 名字
    prefabName: string; // 预制体名字
    prefabBundle: string; // 预制体包名
    resPath: string; // 资源路径
}

/**
 * EnvironmentConfig 配置表数据
 */
export const DB_EnvironmentConfig: Readonly<Record<string, IEnvironmentConfig>> = {
  '100101': {
    'id': 100101,
    'name': '墙',
    'prefabName': 'Wall',
    'prefabBundle': 'start',
    'resPath': 'game/environment/render/wall/'
  },
  '100201': {
    'id': 100201,
    'name': '门',
    'prefabName': 'Door',
    'prefabBundle': 'start',
    'resPath': 'game/environment/render/door/'
  },
  '100301': {
    'id': 100301,
    'name': '地板',
    'prefabName': 'Floor',
    'prefabBundle': 'start',
    'resPath': 'game/environment/render/floor/'
  },
  '100401': {
    'id': 100401,
    'name': '箱子',
    'prefabName': 'Box',
    'prefabBundle': 'start',
    'resPath': 'game/environment/render/box/'
  },
  '100501': {
    'id': 100501,
    'name': '宝箱',
    'prefabName': 'TreasureChest',
    'prefabBundle': 'start',
    'resPath': 'game/environment/render/treasureChest/'
  },
  '100601': {
    'id': 100601,
    'name': '地图传送门',
    'prefabName': 'MapTransfer',
    'prefabBundle': 'start',
    'resPath': 'game/environment/render/mapTransfer/'
  }
} as const;

/**
 * 获取 EnvironmentConfig 配置项
 * @param id 配置ID
 */
export function getEnvironmentConfig(id: string | number): IEnvironmentConfig | undefined {
    return DB_EnvironmentConfig[String(id)];
}

/**
 * 获取所有 EnvironmentConfig 配置项
 */
export function getAllEnvironmentConfig(): IEnvironmentConfig[] {
    return Object.values(DB_EnvironmentConfig);
}

/**
 * 查找 EnvironmentConfig 配置项
 * @param predicate 查找条件
 */
export function findEnvironmentConfig(predicate: (item: IEnvironmentConfig) => boolean): IEnvironmentConfig | undefined {
    return Object.values(DB_EnvironmentConfig).find(predicate);
}

/**
 * 查找所有匹配的 EnvironmentConfig 配置项
 * @param predicate 查找条件
 */
export function findAllEnvironmentConfig(predicate: (item: IEnvironmentConfig) => boolean): IEnvironmentConfig[] {
    return Object.values(DB_EnvironmentConfig).filter(predicate);
}
