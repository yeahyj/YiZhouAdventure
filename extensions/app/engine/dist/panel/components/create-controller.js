"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const vue_1 = __importDefault(require("../../../../vue"));
const utils_1 = require("../../utils");
/**
 * 根据语言获取脚本内容
 */
function getScript(name) {
    const basePath = '../../../extensions/app/assets/base/BaseController';
    return 'import BaseController from \'' + basePath + '\';\r\n' +
        'export class ' + name + ' extends BaseController<' + name + ', {\r\n' +
        '    // 定义了事件，并同时定义参数列表和返回值\r\n' +
        '    Refresh: (a: number) => boolean\r\n' +
        '}>() {\r\n' +
        '    // Controller中发射事件, UI中监听事件:\r\n' +
        '    // 1、UI中需要将 「extends BaseView」 改为=> 「extends BaseView.bindController(' + name + ')」\r\n' +
        '    // 2、UI中使用「this.controller.on/once」监听事件, 使用「this.controller.emit」发射事件, 使用「this.controller.off/targetOff」取消监听事件\r\n' +
        '    // 3、在外部(无法使用this.controller的地方)可以通过「app.controller.xxx」来调用对外导出的方法, 比如下面的refresh方法\r\n' +
        '    refresh() {\r\n' +
        '        this.emit(' + name + '.Event.Refresh, 1000); // 参数类型正确\r\n' +
        '        this.emit(' + name + '.Event.Refresh, true); // 参数类型错误\r\n' +
        '        const result = this.call(' + name + '.Event.Refresh, 1000); // 自动推导返回值类型\r\n' +
        '    }\r\n' +
        '}';
}
exports.default = vue_1.default.extend({
    template: utils_1.getResPanel('create-controller'),
    data() {
        return {
            inputName: '',
            display: '',
            showLoading: false
        };
    },
    methods: {
        async onClickCreate() {
            const name = this.inputName;
            if (/^[a-z][a-z0-9-]*[a-z0-9]+$/.test(name) === false) {
                this.display = '[错误] 名字不合法\n1、不能以数字开头\n2、不能有大写字母\n3、分隔符只能使用-\n4、不能以分隔符开头或结尾';
                return;
            }
            const rootPath = 'db://assets/app-builtin/app-controller';
            const controlName = `${utils_1.stringCase(name)}Controller`;
            const scriptUrl = `${rootPath}/${controlName}.ts`;
            // 创建前确认
            const createResponse = await Editor.Dialog.info('请确认', { detail: controlName, buttons: ['创建并打开', '仅创建', '取消'], default: 0, cancel: 2 });
            if (createResponse.response == 2) {
                return;
            }
            this.display = '创建中';
            this.showLoading = true;
            if (fs_1.existsSync(utils_1.convertUrlToPath(scriptUrl))) {
                this.showLoading = false;
                this.display = `[错误] 文件已存在, 请删除\n${scriptUrl}`;
                return;
            }
            // 目录如果不存在则创建
            if (!await utils_1.createFolderByUrl(rootPath, { meta: utils_1.getResMeta('app-controller'), readme: utils_1.getResReadme('app-controller') })) {
                this.showLoading = false;
                this.display = `[错误] 创建目录失败\n${rootPath}`;
                return;
            }
            // 创建script
            const createScriptResult = await Editor.Message.request('asset-db', 'create-asset', scriptUrl, getScript(controlName)).catch(_ => null);
            if (!createScriptResult) {
                this.showLoading = false;
                this.display = `[错误] 创建脚本失败\n${scriptUrl}`;
                return;
            }
            this.showLoading = false;
            this.display = `[成功] 创建成功\n${rootPath}`;
            Editor.Message.send('assets', 'twinkle', scriptUrl);
            // 是否打开
            if (createResponse.response == 0) {
                Editor.Message.request('asset-db', 'open-asset', scriptUrl);
            }
        }
    },
});
