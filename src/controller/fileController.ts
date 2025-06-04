import {createWriteStream,createReadStream,stat} from "node:fs";
import {ErrorMiddleware} from "../middleware/errorMiddleware.ts";
import {parseQuery} from "../middleware/requestParse.ts";
import busboy from "busboy";
import {IncomingMessage,ServerResponse} from "node:http";
import {fileUploadModels,getFileModel} from "../models/fileModels.ts";
import os from "node:os";
import {getHeaderValue} from "../utils/utils.ts"
import {join} from "node:path";
let fileName = '';
let folderName = 'myFolder';
export const fileuploadController = async(req:IncomingMessage,res:ServerResponse)=>{
	try{
		const fileLength = parseInt(req.headers['content-length'] || '0',10);
		const maxSize = 10*1024*1024;
		if(maxSize < fileLength){
			const err = new Error("Payload too Large");
			err.status = 413;
			throw err;
		}
		const _busboy = busboy({headers:req.headers,limits:{
			fileSize : maxSize,
			file:1,
		}});
		_busboy.on('file',(filefield:string,file:NodeJS.ReadableStream,info:{filename:string,mimeType:string})=>{
			const {filename,mimeType} = info;
			const allowedType = ['application/pdf','image/jpeg','image/png'];
			if(!allowedType.includes(mimeType)){
				const err = new Error('File type not supported');
				err.status = 422;
				throw err;
			}
			fileName = filename;
			const filePath = join(os.homedir(),folderName,fileName);
			file.pipe(createWriteStream(filePath));
		});
		_busboy.on('finish',async()=>{
			try{
				const user_id = parseInt(req.userId);
				await fileUploadModels(fileName,folderName,user_id,fileLength);
				res.writeHead(201,{
					'Content-Type':'application/json',
				});
				res.end(JSON.stringify({message:"File uploaded successfully"}));
			}catch(err:any){
				throw err;
			}
		})
		req.pipe(_busboy);
	}catch(err:any){
		err.res = res;
		const error = ErrorMiddleware(err);
		error.responseToClient();
	}
}
export const filedownloadController = async(req:IncomingMessage,res:ServerResponse)=>{
	try{
		const {filename,id} = parseQuery(req);
		if (!filename || typeof filename !== 'string' || filename.trim() === '') {
			const err = new Error("Missing or Invalid filename");
			err.status = 400;
			throw err;
		}

		if (!id || isNaN(Number(id))) {
			const err = new Error("Invalid id formate");
			err.status = 400;
			throw err;
		}
		const {filepath,size} = await getFileModel(filename,id);
		const path = join(os.homedir(),filepath,filename);
		const headerValue = getHeaderValue(filename);
		const range = req.headers['range'] ?? "";	
		if(range){
			const parseRange = range.replace("bytes=",'').split('-');
			const start = parseRange[0] ? parseInt(parseRange[0],10) : 0;
			const end = parseRange[parseRange.length-1] ? parseInt(parseRange[parseRange.length-1],10) : size-1;
			const chunkSize = end-start+1;
			if(start > end || end > size ){
				const err = new Error("The requested range is not valid for this file");
				err.status = 416;
				throw err;
			}
			res.writeHead(206,{
				'Content-Range': `bytes ${start}-${end}/${size}`,
				'Content-Type': `${headerValue}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunkSize,
				'Content-Disposition': `attachment; filename="${filename}"`,
			});
			const readStream = createReadStream(path,{start,end});
			readStream.pipe(res);
			readStream.on('end', () => {
				console.log("✅ Partial file sent successfully");
			});
		}else{
			const readStream = createReadStream(path);
			res.writeHead(200,{'Content-Type': `${headerValue}`,
			});
			readStream.pipe(res);
		}
	}catch(err:any){
		err.res = res;
		const error = new ErrorMiddleware(err);
		error.responseToClient();
	}
}
