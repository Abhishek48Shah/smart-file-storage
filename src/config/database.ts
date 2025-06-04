import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const {Client} = pkg;
const client = new Client({
	user:process.env.DB_USER,
	password:process.env.DB_password,
	host:process.env.DB_HOST,
	database:process.env.DB_DATABASE,
	port:process.env.DB_PORT,
});
client.connect()
.then(()=>console.log("Successfully connected to the database"))
.catch((err)=>console.log(err.stack));
export default client;
