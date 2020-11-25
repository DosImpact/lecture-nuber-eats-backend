import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

// 방법1. MiddlewareConsumer 에서 apply해서 사용
@Injectable()
export class JwtMiddleWare implements NestMiddleware{
    constructor(  
         private readonly jwtService:JwtService,
         private readonly usersService:UsersService){}
    async use(req: Request, res: Response, next:NextFunction){
        // console.log(req.headers["banana"]);
        // console.log("JwtMiddleWare");
        if("x-jwt" in req.headers){
            const token = req.headers["x-jwt"];
            try {
                const decoded = this.jwtService.verify(token.toString());
                if( typeof decoded === "object" && decoded.hasOwnProperty('id')){
                    //  console.log( decoded['id']);
                     const user = await this.usersService.findById(decoded['id']);
                    //  console.log(user);
                    req['user'] = user;
                }
            } catch (error) {}
        }
        next();
    }
}

// 방법2. 함수형태로 만들어서 미들웨어를 만들어도 된다. 
// index.ts 에서 use로 사용! 
export function JwtMiddleWareFunc(req:Request,res:Response,next:NextFunction) {
    // console.log(req.headers);
    console.log("JwtMiddleWareFunc");
    next();
}