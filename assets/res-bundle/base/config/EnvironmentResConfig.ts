// 自动生成的配置文件，请勿手动修改

/**
 * EnvironmentResConfig 配置表接口
 */
export interface IEnvironmentResConfig {
    id: number; // 环境资源id
    name: string; // 名字
    environmentId: number; // 环境id
    resBundle: string; // 资源包名
}

/**
 * EnvironmentResConfig 配置表数据
 */
export const DB_EnvironmentResConfig: Readonly<Record<string, IEnvironmentResConfig>> = {
  '100101': {
    'id': 100101,
    'name': '墙',
    'environmentId': 100101,
    'resBundle': 'start'
  },
  '200101': {
    'id': 200101,
    'name': '门',
    'environmentId': 100201,
    'resBundle': 'dungeon'
  },
  '200201': {
    'id': 200201,
    'name': '传送地图门',
    'environmentId': 100201,
    'resBundle': 'start'
  },
  '300101': {
    'id': 300101,
    'name': '地板',
    'environmentId': 100301,
    'resBundle': 'dungeon'
  },
  '300201': {
    'id': 300201,
    'name': '地板',
    'environmentId': 100301,
    'resBundle': 'start'
  },
  '400101': {
    'id': 400101,
    'name': '箱子',
    'environmentId': 100401,
    'resBundle': 'dungeon'
  },
  '500101': {
    'id': 500101,
    'name': '宝箱',
    'environmentId': 100501,
    'resBundle': 'dungeon'
  },
  '600101': {
    'id': 600101,
    'name': '地图传送门',
    'environmentId': 100601,
    'resBundle': 'start'
  }
} as const;

/**
 * 获取 EnvironmentResConfig 配置项
 * @param id 配置ID
 */
export function getEnvironmentResConfig(id: string | number): IEnvironmentResConfig | undefined {
    return DB_EnvironmentResConfig[String(id)];
}

/**
 * 获取所有 EnvironmentResConfig 配置项
 */
export function getAllEnvironmentResConfig(): IEnvironmentResConfig[] {
    return Object.values(DB_EnvironmentResConfig);
}

/**
 * 查找 EnvironmentResConfig 配置项
 * @param predicate 查找条件
 */
export function findEnvironmentResConfig(predicate: (item: IEnvironmentResConfig) => boolean): IEnvironmentResConfig | undefined {
    return Object.values(DB_EnvironmentResConfig).find(predicate);
}

/**
 * 查找所有匹配的 EnvironmentResConfig 配置项
 * @param predicate 查找条件
 */
export function findAllEnvironmentResConfig(predicate: (item: IEnvironmentResConfig) => boolean): IEnvironmentResConfig[] {
    return Object.values(DB_EnvironmentResConfig).filter(predicate);
}
