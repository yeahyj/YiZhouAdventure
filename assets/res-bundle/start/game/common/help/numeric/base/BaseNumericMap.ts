import { AttributeType, CorrectionType, CorrectionSourceType } from '../../CommonEnum';
import { CorrectionAttributeData, INumericDecorator } from '../../CommonInterface';
import { BaseNumeric } from './BaseNumeric';

/** 属性变化回调函数类型 */
export type NumericChangeCallback = (type: AttributeType) => void;
/** 属性阈值回调函数类型 */
export type NumericThresholdCallback = (current: number, max: number) => void;

/**
 * 基础属性管理器
 * 作为所有属性管理器的基类，提供基础的属性管理功能
 */
export abstract class BaseNumericMap<T extends BaseNumeric> {
    /** 属性映射表 */
    protected numerics: Map<AttributeType, T> = new Map();
    /** 变化回调 */
    protected changeCallbacks: Set<NumericChangeCallback> = new Set();
    /** 阈值回调 */
    protected thresholdCallbacks: Map<AttributeType, Set<NumericThresholdCallback>> = new Map();

    /**
     * 创建属性实例
     */
    abstract createNumeric(type: AttributeType): T;

    /**
     * 获取属性
     */
    get(type: AttributeType): T {
        let numeric = this.numerics.get(type);
        if (!numeric) {
            numeric = this.createNumeric(type);
            this.numerics.set(type, numeric);
        }
        return numeric;
    }

    /**
     * 添加属性修正
     */
    addCorrection(type: AttributeType, data: CorrectionAttributeData): void {
        const numeric = this.get(type);
        numeric.addCorrection(data);
        this.notifyChange(type);
    }

    /**
     * 移除属性修正
     */
    removeCorrection(type: AttributeType, data: CorrectionAttributeData): void {
        const numeric = this.get(type);
        numeric.removeCorrection(data);
        this.notifyChange(type);
    }

    /**
     * 获取属性当前值
     */
    getValue(type: AttributeType): number {
        return this.get(type).getValue();
    }

    /**
     * 获取属性最大值
     */
    getMaxValue(type: AttributeType): number {
        return this.get(type).maxValue;
    }

    /**
     * 获取属性基础值
     */
    getBaseValue(type: AttributeType): number {
        return this.get(type).getBaseValue();
    }

    /**
     * 设置属性基础值
     */
    setBaseValue(type: AttributeType, value: number): void {
        const numeric = this.get(type);
        numeric.setBaseValue(value);
        this.notifyChange(type);
    }

    /**
     * 添加变化回调
     */
    addChangeCallback(callback: NumericChangeCallback): void {
        this.changeCallbacks.add(callback);
    }

    /**
     * 移除变化回调
     */
    removeChangeCallback(callback: NumericChangeCallback): void {
        this.changeCallbacks.delete(callback);
    }

    /**
     * 添加阈值回调
     */
    addThresholdCallback(type: AttributeType, callback: NumericThresholdCallback): void {
        let callbacks = this.thresholdCallbacks.get(type);
        if (!callbacks) {
            callbacks = new Set();
            this.thresholdCallbacks.set(type, callbacks);
        }
        callbacks.add(callback);
    }

    /**
     * 移除阈值回调
     */
    removeThresholdCallback(type: AttributeType, callback: NumericThresholdCallback): void {
        const callbacks = this.thresholdCallbacks.get(type);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.thresholdCallbacks.delete(type);
            }
        }
    }

    /**
     * 重置
     */
    reset(): void {
        this.numerics.forEach((numeric) => numeric.reset());
        this.changeCallbacks.clear();
        this.thresholdCallbacks.clear();
    }

    /**
     * 通知属性变化
     */
    protected notifyChange(type: AttributeType): void {
        // 通知变化回调
        this.changeCallbacks.forEach((callback) => callback(type));

        // 通知阈值回调
        const callbacks = this.thresholdCallbacks.get(type);
        if (callbacks) {
            const numeric = this.get(type);
            const current = numeric.getValue();
            const max = numeric.maxValue;
            callbacks.forEach((callback) => callback(current, max));
        }
    }

    /**
     * 初始化属性值
     */
    init(data: Partial<Record<AttributeType, number>>): void {
        const keys = Object.keys(data) as AttributeType[];
        keys.forEach((key) => {
            const value = data[key];
            if (value !== undefined) {
                const attr = this.get(key);
                attr.init(value);
            }
        });
    }

    /**
     * 批量添加属性修正
     */
    addCorrections(decorators: INumericDecorator[]): void {
        for (const decorator of decorators) {
            const correction: CorrectionAttributeData = {
                type: decorator.isPercentage ? CorrectionType.PERCENTAGE : CorrectionType.FIXED,
                value: decorator.value,
                source: decorator.source ?? CorrectionSourceType.OTHER,
            };
            this.addCorrection(decorator.attribute as AttributeType, correction);
        }
    }

    /**
     * 获取所有属性类型
     */
    getTypes(): AttributeType[] {
        return Array.from(this.numerics.keys());
    }

    /**
     * 获取属性数量
     */
    getCount(): number {
        return this.numerics.size;
    }

    /**
     * 检查是否存在属性
     */
    has(type: AttributeType): boolean {
        return this.numerics.has(type);
    }

    /**
     * 删除属性
     */
    delete(type: AttributeType): boolean {
        return this.numerics.delete(type);
    }

    /**
     * 清空所有属性
     */
    clear(): void {
        this.numerics.clear();
        this.changeCallbacks.clear();
        this.thresholdCallbacks.clear();
    }
}
