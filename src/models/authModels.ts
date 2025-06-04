import client from "../config/database.ts";
export const signAuthModels = async(username:string,email:string,password:string,salt:string)=>{
	const query = {
		text:'INSERT INTO users(username,email,password,salt) VALUES($1,$2,$3,$4) RETURNING id',
		values:[username,email,password,salt],
	}
	try{
		const response = await client.query(query);
		if(response.rowCount === 0){
			const err = new Error("Internal server error,Please try again later");
			err.status = 500;
			throw err;
		}
		return response.rows[0].id;
	}catch(err:any){
		if(err.code === '23505'){
			err.message = 'Email already exists';
			err.status = 409;
		}
		throw err;
	}
}
export const loginAuthModels = async(email:string)=>{
	const query = {
		text: 'SELECT * FROM users WHERE email=$1',
			values:[email],	
	}
	try{
		const response = await client.query(query);
		if(response.rowCount === 0){
			const err = new Error("Email not found");
			err.status = 404;
			throw err;
		}
		return response.rows[0];
	}catch(err:any){
		throw err;
	}
}
