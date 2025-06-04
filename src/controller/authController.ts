import {IncomingMessage,ServerResponse} from "node:http";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {send_ServerResponse} from "../middleware/response.ts";
import {ErrorMiddleware} from "../middleware/errorMiddleware.ts";
import {userFormValidation,generate_Salt,generate_HashPassword} from "../utils/utils.ts";
import {signAuthModels,loginAuthModels} from "../models/authModels.ts";
dotenv.config();
export const signupController = async(req:IncomingMessage,res:ServerResponse)=>{
	const username = req.user?.username || "";
	const email = req.user?.email || "";
	const password = req.user?.password || "";
	try{
		if(!username || !email || !password){
			const err = new Error('Bad request-required feild missing ')
			err.status = 400;
			throw err;
		};
		await userFormValidation(email,password);
		const salt = generate_Salt(16);
		const hashedPassword = await generate_HashPassword(password,salt);
		const {id} = await signAuthModels(username,email,hashedPassword,salt); 	
		const token = await jwt.sign({userId:id},process.env.JWT_SECRET,{expiresIn:'1h'})
		res.writeHead(201,{
			'Content-Type': 'application/json',
			'Set-Cookie': `token=${token}; HttpOnly;Max-Age=3600`
		})
		res.end(JSON.stringify({message:'Account created successfully'}));
	}catch(err:any){
		if(!err.status){
			err.status = 500;
		}
		err.res = res;
		const error = new ErrorMiddleware(err);
		error.responseToClient();
	}
};
export const loginController = async(req:IncomingMessage,res:ServerResponse)=>{
	const email = req.user?.email || "";
	const textpassword = req.user?.password || "";	
	try{
		if(!email || !textpassword){
			const err = new Error('Bad request-required feild missing');
			err.status = 400;
			throw err;
		};
		await userFormValidation(email,textpassword);
		const {salt,password,id} = await loginAuthModels(email);
		const hashedPassword = await generate_HashPassword(textpassword,salt);
		if(hashedPassword !== password){
			const err = new Error("Incorrect password");
			err.status = 400;
			throw err;
		};
		const token = await jwt.sign({userId:id},process.env.JWT_SECRET,{expiresIn:'1h'})
		console.log(token);
		res.writeHead(200,{
			'Content-Type': 'application/json',
			'Set-Cookie': `token=${token}; HttpOnly;Max-Age=3600`
		})
		res.end(JSON.stringify({message:"Login successfully"}));
	}catch(err:any){
		if(!err.status){
			err.status = 500;
		}
		err.res = res;
		const error = new ErrorMiddleware(err);
		error.responseToClient();
	}
}
