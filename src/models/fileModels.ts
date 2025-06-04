import client from "../config/database.ts";
export const fileUploadModels = async(filename:string,foldername:string,userid:number,fileLength:number)=>{
	const query = {
		text:'INSERT INTO files (filename,filepath,user_id,size) VALUES($1,$2,$3,$4)',
		values:[filename,foldername,userid,fileLength]
	}
	try{
		const response = await client.query(query);
		if(response.rowCount === 0){
			const err = new Error("Internal Server Error, Please try again later");
			err.statu = 500;
		}	
	}catch(err:any){
		throw err;
	}
}
export const getFileModel = async(filename:string,id:number)=>{
	const query = {
		text:'SELECT filepath,size FROM files WHERE filename=$1 AND id=$2',
			values:[filename,id]	
	};
	try{
		const response = await client.query(query);
		if(response.rows.length === 0){
			const err = new Error("File not found");
			err.status = 404;
			throw err;
		}
		return response.rows[0];
	}catch(err:any){
		if(err instanceof Error  &&  err.status !== 404){
			err.status = 500;
			err.message = "Internal server error ,Please try again later!";
		}
		throw err;
	}
}
