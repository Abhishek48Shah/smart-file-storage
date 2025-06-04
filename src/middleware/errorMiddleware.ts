export class ErrorMiddleware extends Error{
	constructor(err){
		super(err.message);
		this.status = err.status;	
		this.res = err.res;
		this.name = this.ErrorMiddleware;
	}
	responseToClient(){
		this.res.writeHead(this.status,{
			'Content-Type': 'application/json',
		});
		this.res.end(JSON.stringify({message:this.message}));
	}
}
