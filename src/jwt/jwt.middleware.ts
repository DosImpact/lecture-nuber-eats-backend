import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

// 방법1. MiddlewareConsumer 에서 apply해서 사용
export class JwtMiddleWare implements NestMiddleware{
    use(req: Request, res: Response, next:NextFunction){
        // console.log(req.headers);
        console.log("JwtMiddleWare");
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