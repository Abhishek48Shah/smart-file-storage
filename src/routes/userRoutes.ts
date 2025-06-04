import {IncomingMessage,ServerResponse} from "node:http";
import {ErrorMiddleware} from "../middleware/errorMiddleware.ts";
import {parseUrl,parseBody} from "../middleware/requestParse.ts";
import {sessionVerification} from "../utils/utils.ts";
import {loginController,signupController} from "../controller/authController.ts";
import {fileuploadController,filedownloadController} from "../controller/fileController.ts";
export const routes = async(req:IncomingMessage,res:ServerResponse)=>{
	try{
		const {path,reqMethod} = parseUrl(req);
		if(path === 'signup' && reqMethod === 'POST'){
			req.user = await parseBody(req);
			signupController(req,res);
		}else if(path === 'login' && reqMethod === 'POST'){
			req.user = await parseBody(req);
			loginController(req,res);
		}else if(path === 'upload' && reqMethod === 'POST'){
			await sessionVerification(req);
			fileuploadController(req,res);
		}else if(path === 'download' && reqMethod === 'GET'){
			filedownloadController(req,res);
		}

	}catch(err:any){
		err.res = res;
		const error = new ErrorMiddleware(err);
		error.responseToClient();
	}
}
