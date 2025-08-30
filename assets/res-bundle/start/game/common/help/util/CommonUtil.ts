import { Vec3, v3 } from 'cc';

export default class CommonUtil {
    public static deepClone(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => CommonUtil.deepClone(item));
        }

        const clonedObj: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clonedObj[key] = CommonUtil.deepClone(obj[key]);
            }
        }

        return clonedObj;
    }

    /**在数组里面随机取值，数组里面的是对象，对象里面又一个probability参数，总值可能大于1 */
    static randomSelectWithProbability<T extends { probability: number }>(arr: T[]): T | null {
        if (arr.length === 0) {
            return null;
        }

        const totalProbability = arr.reduce((sum, item) => sum + item.probability, 0);
        const randomValue = Math.random() * totalProbability;

        let accumulatedProbability = 0;
        for (const item of arr) {
            accumulatedProbability += item.probability;
            if (randomValue <= accumulatedProbability) {
                return item;
            }
        }

        return arr[arr.length - 1];
    }

    /**数组随机取值 */
    static randomArraySelect<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * 加载icon
     * @param sp 加载节点
     * @param id 配置id
     * @param config 配置
     */
    static loadIcon(sp: Node, id: number, config: { [key: string]: any }) {
        // let iconId = config[id].icon;
        // let iconPath = DB_IconConfig[iconId].path;
        // app.manager.loader.load({
        //     path: 'icon/' + iconPath + '/spriteFrame',
        //     bundle: 'battle',
        //     type: SpriteFrame,
        //     onComplete: (result: SpriteFrame) => {
        //         sp.getComponent(Sprite).spriteFrame = result;
        //     },
        // });
    }

    /**
     * 在两个数之间生成随机数
     * @param min 最小值
     * @param max 最大值
     * @returns 如果只有一个有效参数则返回该参数，否则返回[min, max]范围内的随机数
     */
    static randomBetween(min: number, max: number): number {
        const isValidNumber = (num: number): boolean => {
            return typeof num === 'number' && !Number.isNaN(num) && Number.isFinite(num);
        };

        // 检查参数有效性
        const minValid = isValidNumber(min);
        const maxValid = isValidNumber(max);

        // 如果只有一个有效参数，返回该参数
        if (minValid && !maxValid) return min;
        if (!minValid && maxValid) return max;
        if (!minValid && !maxValid) return 0;

        // 如果相等直接返回
        if (min === max) {
            return min;
        }

        // 确保 min 小于 max
        if (min > max) {
            [min, max] = [max, min];
        }

        // 计算小数位数
        const getDecimalPlaces = (num: number): number => {
            const decimal = num.toString().split('.')[1];
            return decimal ? decimal.length : 0;
        };

        const precision = Math.max(getDecimalPlaces(min), getDecimalPlaces(max));
        const factor = 10 ** precision;

        // 转换为整数计算以避免浮点数精度问题
        const minInt = Math.round(min * factor);
        const maxInt = Math.round(max * factor);

        const randomInt = Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
        return randomInt / factor;
    }

    /**
     * 角度转换为向量
     * @param angle 角度值（0度指向右方，90度指向上方，180度指向左方，270度指向下方）
     * @returns 归一化的方向向量
     */
    static angleToVec(angle: number): Vec3 {
        // 将角度转换为弧度
        const radian = (angle % 360) * (Math.PI / 180);
        // 计算单位向量
        return v3(Math.cos(radian), Math.sin(radian), 0).normalize();
    }

    /**
     * 向量转换为角度
     * @param vec 方向向量
     * @returns 角度值（0-360度，0度指向右方，90度指向上方）
     */
    static vecToAngle(vec: Vec3): number {
        // 计算角度（弧度）
        let angle = Math.atan2(vec.y, vec.x);
        // 转换为角度
        angle = angle * (180 / Math.PI);
        // 确保角度在 0-360 之间
        return (angle + 360) % 360;
    }

    /**
     * 从数组中移除指定元素
     */
    static removeFromArray<T>(array: T[], item: T) {
        const index = array.indexOf(item);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }
}
