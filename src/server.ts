import http from "node:http";
import dotenv from "dotenv";
import {routes} from "./routes/userRoutes.ts";
import {IncomingMessage,ServerResponse} from "node:http";
dotenv.config();
const port = Number(process.env.PORT ?? 8000);
const server = http.createServer((req:IncomingMessage,res:ServerResponse)=>{
	routes(req,res);
});
server.listen(port,()=>{
	console.log(`Server running on port ${port}`);
})
