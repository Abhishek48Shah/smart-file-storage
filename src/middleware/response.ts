import {ServerResponse} from "node:http";
export const send_ServerResponse = (res:ServerResponse,message:string,status:number)=>{
	res.writeHead(status,{
		'Content-Type':'application/json'
	});
	res.end(JSON.stringify({message:message}));
}
