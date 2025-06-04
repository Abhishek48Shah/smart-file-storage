import {scrypt,randomBytes} from "node:crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {parse} from "cookie";
import {promisify} from "node:util";
const async_scrypt = promisify(scrypt);
dotenv.config();
export const  userFormValidation = async (email,password)=>{
	const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
	if(!emailRegex.test(email)){
		const err = new Error("Invalid email formate");
		err.status = 400;
		throw err;
	}
	if(!passwordRegex.test(password)){
		const err = new Error('Invalid password formate');
		err.status = 400;
		throw err;
	}
};
export const generate_Salt = (size:number)=>{
	const salt = randomBytes(size);
	return salt.toString('hex');
}
export const generate_HashPassword = async(password:string,salt:string)=>{
	const hashedPassword = await async_scrypt(password,salt,64);
	return hashedPassword.toString('hex');
}
export const sessionVerification = async(req:IncomingMessage)=>{
	if(!req.headers?.cookie){
		const err = new Error("Unauthorized access");
		err.status = 401;
		throw err;
	}
	const cookie = parse(req.headers.cookie || '');
	let decode = '';
	try{
		const decode = jwt.verify(cookie.token,process.env.JWT_SECRET);
		if(!decode){
			const err = new Error("Unauthorized access: Token Missing");
			err.status = 401;
			throw err;
		}
		req.userId = decode.userId;
	}catch(err:any){
		err = new Error("Unauthorized: Token invalid or expired");
		err.status = 401;
		throw err;
	}
}
export const getHeaderValue = (filename)=>{
	const parts = filename.toLowerCase().split('.');
	const value = parts.length > 1 ? parts[parts.length-1] : '';
	const headerValue = {
		pdf: 'application/pdf',
		jpg: 'application/jpg',
		jpeg: 'application/jpeg',
		png: 'application/png',
		gif: 'application/gif',
		txt: 'text/plain',
	};
	return headerValue[value] || 'application/octet-stream';
}
