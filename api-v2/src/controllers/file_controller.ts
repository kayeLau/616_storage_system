const fs = require('fs');
const path = require('path');

module.exports = class File {
    readLogsName(req, res, next){
        const directoryPath = './logs'; // 指定要读取的目录路径
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('读取目录失败:', err);
                return;
            }
            res.json({ success:true , files:files.filter(item => item.match('.log')) })
        })
    }

    downloadLog(req, res, next) {
        const data = { fileName: req.body.fileName }
        const filePath = './logs/' + data.fileName;
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Error reading log file');
            }
            res.type('text/plain');
            res.send(data);
        });
    }
}