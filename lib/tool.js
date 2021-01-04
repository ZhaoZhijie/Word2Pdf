const { promisify } = require('util');
const async_exec = promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const async_mkdir = promisify(fs.mkdir);
const async_rename = promisify(fs.rename);
const async_rmdir = promisify(fs.rmdir);
const iconv = require('iconv-lite');

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
    let encoding = 'cp936';
    let binaryEncoding = 'binary';
    let cmd = `soffice --headless --convert-to pdf "${docpath}" --outdir ${pdfdir}`;
    console.log(`exec cmd ${cmd}`);
    try{
        await async_exec(cmd, options={encoding:binaryEncoding});
    }catch(ex){
        let message = iconv.decode(Buffer.from(ex.message, binaryEncoding), encoding);
    }
}

module.exports.async_doc2pdf = async_doc2pdf;

















