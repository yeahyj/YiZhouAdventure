import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// 验证器
const configSchema = z
    .object({
        excelFolderPath: z.string().min(1),
        outputFolderPath: z.string().min(1),
        fileExtension: z.string().min(1),
    })
    .required();

// 配置接口
type Config = z.infer<typeof configSchema>;

// 类型定义
type ExcelColumnType = 'number' | 'string' | 'boolean' | 'array' | 'object' | `${string}[]`;
type TypeMapping = Record<string, string>;

interface ColumnDefinition {
    name: string;
    type: ExcelColumnType;
    comment: string;
}

class ExcelProcessor {
    private readonly config: Config;
    private static readonly TYPE_MAPPING: TypeMapping = {
        number: 'number',
        num: 'number',
        int: 'number',
        float: 'number',
        double: 'number',
        string: 'string',
        str: 'string',
        boolean: 'boolean',
        bool: 'boolean',
        array: 'any[]',
        object: 'Record<string, any>',
    };

    constructor(config: Config) {
        this.config = configSchema.parse(config);
    }

    async processAllFiles(): Promise<void> {
        try {
            const files = await fs.readdir(this.config.excelFolderPath);
            const excelFiles = files.filter((file) => path.extname(file) === this.config.fileExtension);

            // 获取所有Excel文件的sheet名称
            const validSheetNames = new Set<string>();
            for (const file of excelFiles) {
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(path.join(this.config.excelFolderPath, file));
                workbook.worksheets.forEach((sheet) => {
                    validSheetNames.add(sheet.name);
                });
            }

            // 清理旧的配置文件
            await this.cleanupOldConfigFiles(validSheetNames);

            // 处理Excel文件
            await Promise.all(
                excelFiles.map((file) =>
                    this.processFile(path.join(this.config.excelFolderPath, file)).catch((error) =>
                        console.error(`处理文件 ${file} 失败:`, error),
                    ),
                ),
            );

            // 生成索引文件
            await this.generateIndexFile(Array.from(validSheetNames));
        } catch (error) {
            throw new Error(`处理Excel文件夹失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async generateIndexFile(sheetNames: string[]): Promise<void> {
        const imports = sheetNames.map((name) => `import { I${name}, DB_${name} } from './${name}';`).join('\n');

        const interfaceExports = sheetNames.map((name) => `    ${name}: I${name};`).join('\n');

        const dbExports = sheetNames
            .map((name) => `    ${name}: DB_${name},`) // 使用逗号而不是分号
            .join('\n');

        const indexContent = `// 自动生成的配置索引文件，请勿手动修改
${imports}

// 所有配置表接口
export interface IConfigs {
${interfaceExports}
}

// 所有配置表数据
export const Configs = {
${dbExports}
} as const;

// 类型安全的获取函数
export function getConfig<T extends keyof IConfigs>(table: T, id: string | number): IConfigs[T] | undefined {
    const db = Configs[table] as Record<string, IConfigs[T]>;
    return db[String(id)];
}

// 获取配置表所有数据
export function getAllConfigs<T extends keyof IConfigs>(table: T): IConfigs[T][] {
    const db = Configs[table] as Record<string, IConfigs[T]>;
    return Object.values(db);
}

// 根据条件查找配置
export function findConfig<T extends keyof IConfigs>(
    table: T,
    predicate: (item: IConfigs[T]) => boolean
): IConfigs[T] | undefined {
    const items = getAllConfigs(table);
    return items.find(predicate);
}

// 根据条件查找所有匹配的配置
export function findConfigs<T extends keyof IConfigs>(
    table: T,
    predicate: (item: IConfigs[T]) => boolean
): IConfigs[T][] {
    const items = getAllConfigs(table);
    return items.filter(predicate);
}

// 配置表工具类型
export type ConfigTableKeys = keyof IConfigs;
export type ConfigItem<T extends ConfigTableKeys> = IConfigs[T];

// 导出所有接口和数据
export type {
${sheetNames.map((name) => `    I${name},`).join('\n')}
};

export {
${sheetNames.map((name) => `    DB_${name},`).join('\n')}
};`;

        const indexPath = path.join(this.config.outputFolderPath, 'index.ts');
        await fs.writeFile(indexPath, indexContent, 'utf-8');
        console.log('✅ 生成配置索引文件:', indexPath);
    }

    private async cleanupOldConfigFiles(validSheetNames: Set<string>): Promise<void> {
        try {
            await fs.mkdir(this.config.outputFolderPath, { recursive: true });
            const files = await fs.readdir(this.config.outputFolderPath);

            for (const file of files) {
                if (path.extname(file) === '.ts' && file !== 'index.ts') {
                    const baseName = path.basename(file, '.ts');
                    if (!validSheetNames.has(baseName)) {
                        const filePath = path.join(this.config.outputFolderPath, file);
                        await fs.unlink(filePath);
                        console.log(`🗑️ 删除过期配置文件: ${file}`);
                    }
                }
            }
        } catch (error) {
            console.error('清理旧配置文件失败:', error);
        }
    }

    private async processFile(filePath: string): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        for (const sheet of workbook.worksheets) {
            await this.processSheet(sheet);
        }
    }

    private async processSheet(sheet: ExcelJS.Worksheet): Promise<void> {
        const sheetName = sheet.name;
        const interfaceName = `I${sheetName}`;

        const columns = this.getColumnDefinitions(sheet);
        const data = this.extractSheetData(sheet, columns);
        const tsCode = this.generateTypeScriptCode(sheetName, interfaceName, columns, data);

        const outputPath = path.join(this.config.outputFolderPath, `${sheetName}.ts`);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, tsCode, 'utf-8');

        console.log(`✅ 成功生成文件: ${outputPath}`);
    }

    private getColumnDefinitions(sheet: ExcelJS.Worksheet): ColumnDefinition[] {
        const typeRow = sheet.getRow(3).values as string[];
        const keyRow = sheet.getRow(2).values as string[];
        const commentRow = sheet.getRow(1).values as string[];

        return typeRow
            .map((type, index) => ({
                name: String(keyRow[index] || ''),
                type: this.normalizeType(type),
                comment: String(commentRow[index] || ''),
            }))
            .filter((col) => col.name);
    }

    private normalizeType(type: string): ExcelColumnType {
        const normalizedType = (type || '').toLowerCase();
        return (ExcelProcessor.TYPE_MAPPING[normalizedType] ??
            (normalizedType.includes('[]') ? normalizedType : 'any')) as ExcelColumnType;
    }

    private extractSheetData(sheet: ExcelJS.Worksheet, columns: ColumnDefinition[]): Record<string, any> {
        const data: Record<string, any> = {};

        sheet.eachRow((row, rowNum) => {
            if (rowNum <= 3) return;

            const id = row.getCell(1).value;
            if (!id) return;

            const rowData: Record<string, any> = {};
            columns.forEach((col, index) => {
                const cellValue = row.getCell(index + 1).value;
                rowData[col.name] = this.convertCellValue(cellValue, col.type);
            });

            data[String(id)] = rowData;
        });

        return data;
    }

    private convertCellValue(value: any, type: ExcelColumnType): any {
        if (value === null || value === undefined || value === '') {
            return this.getDefaultValue(type);
        }

        try {
            switch (type) {
                case 'number': {
                    const num = Number(value);
                    return isFinite(num) ? num : null;
                }
                case 'boolean':
                    return String(value).toLowerCase() === 'true';
                case 'array':
                case 'object':
                    return typeof value === 'string' ? JSON.parse(value) : value;
                default:
                    if (type.includes('[]')) {
                        return typeof value === 'string' ? JSON.parse(value) : [];
                    }
                    return String(value);
            }
        } catch {
            return this.getDefaultValue(type);
        }
    }

    private getDefaultValue(type: ExcelColumnType): any {
        switch (type) {
            case 'number':
                return 0;
            case 'boolean':
                return false;
            case 'array':
                return [];
            case 'object':
                return {};
            default:
                return type.includes('[]') ? [] : '';
        }
    }

    private generateTypeScriptCode(
        sheetName: string,
        interfaceName: string,
        columns: ColumnDefinition[],
        data: Record<string, any>,
    ): string {
        const interfaceProperties = columns
            .map((col) => `    ${col.name}: ${this.getTsType(col.type)}; // ${col.comment}`)
            .join('\n');

        return `// 自动生成的配置文件，请勿手动修改

/**
 * ${sheetName} 配置表接口
 */
export interface ${interfaceName} {
${interfaceProperties}
}

/**
 * ${sheetName} 配置表数据
 */
export const DB_${sheetName}: Readonly<Record<string, ${interfaceName}>> = ${JSON.stringify(data, null, 2).replace(/"/g, "'")} as const;

/**
 * 获取 ${sheetName} 配置项
 * @param id 配置ID
 */
export function get${sheetName}(id: string | number): ${interfaceName} | undefined {
    return DB_${sheetName}[String(id)];
}

/**
 * 获取所有 ${sheetName} 配置项
 */
export function getAll${sheetName}(): ${interfaceName}[] {
    return Object.values(DB_${sheetName});
}

/**
 * 查找 ${sheetName} 配置项
 * @param predicate 查找条件
 */
export function find${sheetName}(predicate: (item: ${interfaceName}) => boolean): ${interfaceName} | undefined {
    return Object.values(DB_${sheetName}).find(predicate);
}

/**
 * 查找所有匹配的 ${sheetName} 配置项
 * @param predicate 查找条件
 */
export function findAll${sheetName}(predicate: (item: ${interfaceName}) => boolean): ${interfaceName}[] {
    return Object.values(DB_${sheetName}).filter(predicate);
}
`;
    }

    private getTsType(type: ExcelColumnType): string {
        return ExcelProcessor.TYPE_MAPPING[type] ?? type;
    }
}

// 配置和启动
const config: Config = {
    excelFolderPath: './excel',
    outputFolderPath: './assets/res-bundle/base/config',
    fileExtension: '.xlsx',
};

const processor = new ExcelProcessor(config);
processor.processAllFiles().catch((error) => {
    console.error('Excel处理失败:', error);
    process.exit(1);
});
