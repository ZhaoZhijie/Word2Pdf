const { promisify } = require('util');
const path = require('path');
const async_exec = promisify(require('child_process').exec);
const global_config = require('../config/global_config.json');
const fs = require('fs');
const async_rename = promisify(fs.rename);


class FileConvert{
    static instance = null;

    static getInstance(){
        if(!FileConvert.instance){
            FileConvert.instance = new FileConvert();
        }
        return FileConvert.instance;
    }

    constructor(){
        this.wordList = [];
        this.init_dockers();
    }
    
    init_dockers(){
        this.dockers = {};
        let maxTaskNum = global_config.max_convert_tasks;
        for(let i = 1; i <= maxTaskNum; i++){
            this.dockers[i] = true;
        }
    }

    async async_convert_word(docpath){
        this.wordList.push(docpath);
        this.check_convert_list();
    }

    check_convert_list(){
        while(this.wordList.length > 0){
            let dockerKey = this.get_free_docker();
            if(!dockerKey){
                break;
            }
            let word = this.wordList.shift();
            this.single_word2pdf(word, dockerKey);
        }
    }

    get_free_docker(){
        console.log(`当前dockers状态 ${JSON.stringify(this.dockers)}`)
        let keys = Object.keys(this.dockers);
        for(let i = 0; i < keys.length; i++){
            let key = keys[i];
            if(this.dockers[key]){
                return key;
            }
        }
        return null;
    }

    lockDocker(key){
        this.dockers[key] = false;
    }

    releaseDocker(key){
        this.dockers[key] = true;
    }

    async single_word2pdf(docpath, dockerKey){
        try{
            console.log(`执行转换任务${docpath}`);
            this.lockDocker(dockerKey);
            await this.async_doc2pdf(docpath, global_config.pdf_path, dockerKey);
            this.releaseDocker(dockerKey);
            console.log(`结束转换任务 ${docpath}`)
            this.check_convert_list();
        }catch(ex){
            console.error(`single_word2pdf path:${docpath} error:${ex}`)
        }
    }

    async async_doc2pdf(docpath, pdfdir, dockerKey){
        try{
            let pdfname = docpath.replace(/\.[^\.]*$/, '.pdf');
            let docname = path.basename(docpath);
            //dir /root/temp in docker container is mapped to /root/Software/Word2Pdf/temp of base OS.
            let cmd = `docker exec word2pdf${dockerKey} /bin/bash -c 'soffice --headless --convert-to pdf /root/uploadFile/${docname} --outdir /root/pdfs'`;
            console.log(`exec cmd ${cmd}`);
            //convert word to pdf
            await async_exec(cmd);
            //move pdf to target folder
            // await async_rename(`/root/Software/Word2Pdf/temp/temp${dockerKey}/${pdfname}`, `${pdfdir}/${pdfname}`);
        }catch(ex){
            console.error(`File ${docpath} convert failed! ${ex}`);
        }
    }
}

function convert_word(docpath){
    var ins = FileConvert.getInstance();
    ins.async_convert_word(docpath);
}


module.exports = convert_word;


