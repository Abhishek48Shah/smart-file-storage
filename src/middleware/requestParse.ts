import {IncomingMessage} from "node:http";
import {parse} from "node:url";
export const parseUrl = (req:IncomingMessage)=>{
	const parsedUrl = parse(req?.url ?? "",true); 
	const path = parsedUrl?.pathname.replace(/^\/+|\/+$/,"") ?? "";
	const reqMethod = req.method;
	return {path,reqMethod};
}
export const parseBody = async <T=any>(req:IncomingMessage):Promise<T>=>{
	return new Promise((resolve,reject)=>{
		let body = "";
		if(req.headers['content-type'] !== 'application/json'){
			const err = new Error('Bad Request');
			err.status = 400;
			reject(err as T);
		}
		req.on('data',(chunk:Buffer)=>body+=chunk.toString());
		req.on('end',()=>{
			try{
				const parsedBody = JSON.parse(body);
				resolve(parsedBody as T);
			}catch(err:any){
				err.status = 500;
				err.message  = "Invalid JSON";
				reject(err as T);
			}
		});
		req.on('error',(err:any)=>{
			err.status = 500;
			reject(err as T);
		});
	
	})
}
export const parseQuery = (req:IncomingMessage)=>{
	const parsedUrl = parse(req?.url ?? "",true);
	const query = parsedUrl?.query || "";
	return query;
}
