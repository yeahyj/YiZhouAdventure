import { AttributeType, CorrectionType } from '../../CommonEnum';
import { CorrectionAttributeData } from '../../CommonInterface';

/**
 * 数值修正器基类
 */
export abstract class BaseNumeric {
    /** 属性类型 */
    readonly type: AttributeType;

    /** 基础值 */
    protected base: number = 0;
    /** 成长修正 */
    protected readonly growth: Set<CorrectionAttributeData> = new Set();
    /** 修饰器修正 */
    protected readonly modifier: Set<CorrectionAttributeData> = new Set();
    /** 固定值修正 */
    protected fixed: CorrectionAttributeData | null = null;

    /** 缓存的最大值 */
    private cachedMaxValue: number | null = null;
    /** 缓存的当前值 */
    private cachedValue: number | null = null;
    /** 缓存的修正器排序 */
    private cachedModifiers: CorrectionAttributeData[] | null = null;
    /** 缓存的成长修正排序 */
    private cachedGrowth: CorrectionAttributeData[] | null = null;
    /** 是否需要更新缓存 */
    private isDirty: boolean = true;
    /** 值变化回调 */
    protected onValueChange?: (value: number) => void;

    constructor(type: AttributeType) {
        this.type = type;
    }

    /**
     * 获取属性类型
     */
    getType(): AttributeType {
        return this.type;
    }

    /**
     * 获取当前值
     */
    getValue(): number {
        if (this.isDirty || this.cachedValue === null) {
            this.cachedValue = this.calculateValue();
            this.isDirty = false;
        }
        return this.cachedValue;
    }

    /**
     * 初始化基础值
     */
    init(value: number): void {
        if (this.base !== value) {
            this.base = value;
            this.markDirty();
        }
    }

    /**
     * 设置基础值
     */
    setBaseValue(value: number): void {
        if (this.base !== value) {
            this.base = value;
            this.markDirty();
        }
    }

    /**
     * 获取基础值
     */
    getBaseValue(): number {
        return this.base;
    }

    /**
     * 获取最大值
     */
    get maxValue(): number {
        if (this.isDirty || this.cachedMaxValue === null) {
            this.cachedMaxValue = this.calculateMaxValue();
        }
        return this.cachedMaxValue;
    }

    /**
     * 设置值变化回调
     */
    setValueChangeCallback(callback: (value: number) => void): void {
        this.onValueChange = callback;
    }

    /**
     * 添加属性修正
     */
    addCorrection(data: CorrectionAttributeData): void {
        switch (data.type) {
            case CorrectionType.GROWTH:
                if (!this.growth.has(data)) {
                    this.growth.add(data);
                    this.cachedGrowth = null;
                    this.markDirty();
                }
                break;
            case CorrectionType.MODIFIER:
            case CorrectionType.PERCENTAGE:
                if (!this.modifier.has(data)) {
                    this.modifier.add(data);
                    this.cachedModifiers = null;
                    this.markDirty();
                }
                break;
            case CorrectionType.FIXED:
                if (this.fixed !== data) {
                    this.fixed = data;
                    this.markDirty();
                }
                break;
        }
    }

    /**
     * 移除属性修正
     */
    removeCorrection(data: CorrectionAttributeData): void {
        switch (data.type) {
            case CorrectionType.GROWTH:
                if (this.growth.delete(data)) {
                    this.cachedGrowth = null;
                    this.markDirty();
                }
                break;
            case CorrectionType.MODIFIER:
            case CorrectionType.PERCENTAGE:
                if (this.modifier.delete(data)) {
                    this.cachedModifiers = null;
                    this.markDirty();
                }
                break;
            case CorrectionType.FIXED:
                if (this.fixed === data) {
                    this.fixed = null;
                    this.markDirty();
                }
                break;
        }
    }

    /**
     * 获取修正器优先级
     */
    protected getCorrectionPriority(data: CorrectionAttributeData): number {
        return data.priority ?? 0;
    }

    /**
     * 获取排序后的修正器列表
     */
    protected getSortedModifiers(): CorrectionAttributeData[] {
        if (this.cachedModifiers === null) {
            this.cachedModifiers = Array.from(this.modifier).sort(
                (a, b) => this.getCorrectionPriority(b) - this.getCorrectionPriority(a),
            );
        }
        return this.cachedModifiers;
    }

    /**
     * 获取排序后的成长修正列表
     */
    protected getSortedGrowth(): CorrectionAttributeData[] {
        if (this.cachedGrowth === null) {
            this.cachedGrowth = Array.from(this.growth).sort(
                (a, b) => this.getCorrectionPriority(b) - this.getCorrectionPriority(a),
            );
        }
        return this.cachedGrowth;
    }

    /**
     * 计算当前值
     */
    protected calculateValue(): number {
        if (this.fixed) {
            return this.fixed.value;
        }

        let value = this.calculateMaxValue();

        // 应用修正
        for (const mod of this.getSortedModifiers()) {
            if (mod.type === CorrectionType.PERCENTAGE) {
                value *= 1 + mod.value;
            } else {
                value += mod.value;
            }
        }

        return Math.max(0, value);
    }

    /**
     * 计算最大值
     */
    protected calculateMaxValue(): number {
        let value = this.base;

        // 应用成长修正
        for (const growth of this.getSortedGrowth()) {
            if (growth.type === CorrectionType.PERCENTAGE) {
                value *= 1 + growth.value;
            } else {
                value += growth.value;
            }
        }

        return Math.max(0, value);
    }

    /**
     * 标记需要更新
     */
    protected markDirty(): void {
        this.isDirty = true;
        this.onDirty();
    }

    /**
     * 当数值变脏时的回调
     */
    protected onDirty(): void {
        if (this.onValueChange) {
            this.onValueChange(this.getValue());
        }
    }

    /**
     * 重置状态
     */
    reset(): void {
        this.growth.clear();
        this.modifier.clear();
        this.fixed = null;
        this.base = 0;
        this.cachedGrowth = null;
        this.cachedModifiers = null;
        this.markDirty();
    }

    /**
     * 获取修正器数量
     */
    getCorrectionCount(): { growth: number; modifier: number; fixed: number } {
        return {
            growth: this.growth.size,
            modifier: this.modifier.size,
            fixed: this.fixed ? 1 : 0,
        };
    }
}
