// 自动生成的配置文件，请勿手动修改

/**
 * StaffConfig 配置表接口
 */
export interface IStaffConfig {
    id: number; // 道具id
    name: string; // 名字
    isDisorder: boolean; // 是否乱序
    castNum: number[]; // 施法数
    castDelay: number[]; // 释放延迟
    chargeTime: number[]; // 充能时间
    mpMax: number[]; // 法力最大值
    mpChargeSpeed: number[]; // 法力充能速度
    capacity: number[]; // 容量
    scatter: number[]; // 散射
    magicStones: number[]; // 魔法石
    magicStoneMax: number[]; // 魔法石上限
    resBundle: string; // 资源包名
    resPath: string; // 资源路径
}

/**
 * StaffConfig 配置表数据
 */
export const DB_StaffConfig: Readonly<Record<string, IStaffConfig>> = {
  '100101': {
    'id': 100101,
    'name': '小法杖',
    'isDisorder': false,
    'castNum': [
      1
    ],
    'castDelay': [
      0.1
    ],
    'chargeTime': [
      0.5
    ],
    'mpMax': [
      400
    ],
    'mpChargeSpeed': [
      100
    ],
    'capacity': [
      5
    ],
    'scatter': [
      5
    ],
    'magicStones': [
      100101
    ],
    'magicStoneMax': [
      5
    ],
    'resBundle': 'start',
    'resPath': 'game/staff/render/res/staff/staff_1'
  }
} as const;

/**
 * 获取 StaffConfig 配置项
 * @param id 配置ID
 */
export function getStaffConfig(id: string | number): IStaffConfig | undefined {
    return DB_StaffConfig[String(id)];
}

/**
 * 获取所有 StaffConfig 配置项
 */
export function getAllStaffConfig(): IStaffConfig[] {
    return Object.values(DB_StaffConfig);
}

/**
 * 查找 StaffConfig 配置项
 * @param predicate 查找条件
 */
export function findStaffConfig(predicate: (item: IStaffConfig) => boolean): IStaffConfig | undefined {
    return Object.values(DB_StaffConfig).find(predicate);
}

/**
 * 查找所有匹配的 StaffConfig 配置项
 * @param predicate 查找条件
 */
export function findAllStaffConfig(predicate: (item: IStaffConfig) => boolean): IStaffConfig[] {
    return Object.values(DB_StaffConfig).filter(predicate);
}
