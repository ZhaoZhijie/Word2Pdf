const path = require('path');
const {async_doc2pdf} = require('./tool');
const global_config = require('../config/global_config.json');

class FileConvert{
    static instance = null;

    constructor(){
        this.wordList = [];
        this.taskNum = 0;
    }

    static getInstance(){
        if(!FileConvert.instance){
            FileConvert.instance = new FileConvert();
        }
        return FileConvert.instance;
    }

    async async_convert_word(docpath){
        console.log(`添加文件到队列${docpath}`)
        this.wordList.push(docpath);
        this.check_convert_list();
    }

    async check_convert_list(){
        console.log(`检查队列是否有任务可执行`);
        while(this.wordList.length > 0 && !this.is_tasks_busy()){
            let word = this.wordList.shift();
            this.single_word2pdf(word);
        }
    }

    enter_task(){
        this.taskNum++;
    }

    quit_task(){
        this.taskNum--;
    }

    is_tasks_busy(){
        return this.taskNum >= global_config.max_convert_tasks
    }


    async single_word2pdf(docpath){
        console.log(`执行转换任务${docpath}`);
        this.enter_task();
        await async_doc2pdf(docpath, global_config.pdf_path);
        this.quit_task();
        console.log(`结束转换任务 ${docpath}`)
        this.check_convert_list();
    }
}

function convert_word(docpath){
    var ins = FileConvert.getInstance();
    ins.async_convert_word(docpath);
}


module.exports = convert_word;




































