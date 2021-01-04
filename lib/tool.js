const { promisify } = require('util');
const async_exec = promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const async_mkdir = promisify(fs.mkdir);
const async_rename = promisify(fs.rename);
const async_rmdir = promisify(fs.rmdir);

function copyFile(src, dist) {
    fs.writeFileSync(dist, fs.readFileSync(src));
  }

/**
 * Transform a single word file to pdf
 * soffice can just generat one pdf at one time even there are multi-processes. so, if use soffice to convert, max_convert_tasks must to be set 1
 * @param {*} docpath 
 * @param {*} pdfdir 
 */
async function async_doc2pdf(docpath, pdfdir){
    let cmd = `soffice --headless --convert-to pdf "${docpath}" --outdir ${pdfdir}`;
    console.log(`exec cmd ${cmd}`);
    try{
        await async_exec(cmd);
    }catch(ex){
        console.error(`File ${docpath} convert failed! ${ex}`);
    }
}

module.exports.async_doc2pdf = async_doc2pdf;
module.exports.copyFile = copyFile;

















