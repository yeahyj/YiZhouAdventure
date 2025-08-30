// 自动生成的配置文件，请勿手动修改

/**
 * ResourceConfig 配置表接口
 */
export interface IResourceConfig {
    id: number; // 道具id
    name: string; // 名字
    icon: string; // icon
    unlockLv: number; // 解锁等级
    dropWeight: number; // 掉落权重
}

/**
 * ResourceConfig 配置表数据
 */
export const DB_ResourceConfig: Readonly<Record<string, IResourceConfig>> = {
  '100101': {
    'id': 100101,
    'name': '闪闪币',
    'icon': '6001001',
    'unlockLv': 1,
    'dropWeight': 100
  }
} as const;

/**
 * 获取 ResourceConfig 配置项
 * @param id 配置ID
 */
export function getResourceConfig(id: string | number): IResourceConfig | undefined {
    return DB_ResourceConfig[String(id)];
}

/**
 * 获取所有 ResourceConfig 配置项
 */
export function getAllResourceConfig(): IResourceConfig[] {
    return Object.values(DB_ResourceConfig);
}

/**
 * 查找 ResourceConfig 配置项
 * @param predicate 查找条件
 */
export function findResourceConfig(predicate: (item: IResourceConfig) => boolean): IResourceConfig | undefined {
    return Object.values(DB_ResourceConfig).find(predicate);
}

/**
 * 查找所有匹配的 ResourceConfig 配置项
 * @param predicate 查找条件
 */
export function findAllResourceConfig(predicate: (item: IResourceConfig) => boolean): IResourceConfig[] {
    return Object.values(DB_ResourceConfig).filter(predicate);
}
