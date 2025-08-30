import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { GridMoveType } from '../help/RoomEnum';
import { IGridMoveData } from '../help/RoomInterface';

/**
 * 房间数据组件
 */
@ecs.register('RoomGridMoveTypeComp')
export class RoomGridMoveTypeComp extends ecs.Comp {
    /**格子移动类型 */
    private gridMoveType: { [key: number]: IGridMoveData[] } = {};

    /**添加格子一个移动类型 */
    addGridMoveType(index: number, moveData: IGridMoveData) {
        if (!this.gridMoveType[index]) {
            this.gridMoveType[index] = [];
        }
        // 检查是否是同一个对象引用
        if (!this.gridMoveType[index].includes(moveData)) {
            this.gridMoveType[index].push(moveData);
        }
    }

    /**删除格子一个移动类型 */
    reduceGridMoveType(index: number, moveData: IGridMoveData) {
        if (!this.gridMoveType[index]) return;

        // 使用对象引用来查找和删除
        const typeIndex = this.gridMoveType[index].indexOf(moveData);
        if (typeIndex !== -1) {
            this.gridMoveType[index].splice(typeIndex, 1);
        }
    }

    /**删除格子特定类型的所有数据 */
    removeGridMoveTypeByType(index: number, type: GridMoveType) {
        if (!this.gridMoveType[index]) return;

        this.gridMoveType[index] = this.gridMoveType[index].filter((item) => item.type !== type);
    }

    /**清空格子移动类型 */
    clearGridMoveType(index: number, clearOverride = true) {
        if (!this.gridMoveType[index]) return;

        if (clearOverride) {
            this.gridMoveType[index] = [];
        } else {
            this.gridMoveType[index] = this.gridMoveType[index].filter((item) => item.isOverride);
        }
    }

    /**获取格子移动类型 */
    getGridMoveType(index: number): GridMoveType {
        const moveDataList = this.gridMoveType[index];
        if (!moveDataList?.length) {
            return GridMoveType.BLOCK;
        }

        // 先检查override类型
        const overrideData = moveDataList.filter((item) => item.isOverride);
        if (overrideData.length > 0) {
            // 找出override中type最大的
            return Math.max(...overrideData.map((item) => item.type));
        }

        // 没有override时，检查普通类型
        const normalData = moveDataList.filter((item) => !item.isOverride);
        if (normalData.length > 0) {
            // 找出普通类型中type最大的
            return Math.max(...normalData.map((item) => item.type));
        }

        return GridMoveType.BLOCK;
    }

    /**检查格子是否包含特定类型 */
    hasGridMoveType(index: number, type: GridMoveType): boolean {
        return this.gridMoveType[index]?.some((item) => item.type === type) ?? false;
    }

    /**获取格子所有移动类型数据 */
    getGridMoveDataList(index: number): IGridMoveData[] {
        return this.gridMoveType[index] ?? [];
    }

    /**获取格子特定类型的所有数据 */
    getGridMoveDataByType(index: number, type: GridMoveType): IGridMoveData[] {
        return this.gridMoveType[index]?.filter((item) => item.type === type) ?? [];
    }

    /**获取格子特定类型的所有格子索引 */
    getGridMoveDataByTypeIndex(type: GridMoveType): number[] {
        let list = [];
        for (const key in this.gridMoveType) {
            if (this.gridMoveType[key].some((item) => item.type === type)) {
                list.push(+key);
            }
        }
        return list;
    }

    reset(): void {
        this.gridMoveType = {};
    }
}
