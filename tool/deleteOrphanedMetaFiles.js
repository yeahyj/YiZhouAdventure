const fs = require('fs');
const path = require('path');

const directoryPath = 'E:/meimeng/YiZhouAdventure'; // 替换为你的目录路径

function deleteOrphanedMetaFiles(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.error('无法读取目录: ' + err);
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file);

            // 检查是否是文件夹
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    return console.error('无法获取文件状态: ' + err);
                }

                if (stats.isDirectory()) {
                    // 递归遍历子文件夹
                    deleteOrphanedMetaFiles(filePath);
                } else if (path.extname(file) === '.meta') {
                    const originalFilePath = filePath.slice(0, -5); // 去掉 .meta 扩展名

                    // 检查对应的文件或文件夹是否存在
                    fs.access(originalFilePath, fs.constants.F_OK, (err) => {
                        if (err) {
                            // 对应的文件或文件夹不存在，删除 .meta 文件
                            console.log('对应的文件或文件夹不存在，删除 .meta 文件: ' + filePath);
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error('删除 .meta 文件失败: ' + err);
                                } else {
                                    console.log('已删除: ' + filePath);
                                }
                            });
                        } else {
                            // console.log('对应的文件或文件夹存在: ' + originalFilePath);
                        }
                    });
                }
            });
        });
    });
}

// 开始遍历
deleteOrphanedMetaFiles(directoryPath);
