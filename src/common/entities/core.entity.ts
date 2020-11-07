import { Field } from "@nestjs/graphql";
import {  CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * id , createdAt, updatedAt ( 모든 entity의 디폴트)
 */

@Entity()
export class CoreEntity{
    @PrimaryGeneratedColumn()
    @Field(type=>Number)
    id:number;

    @CreateDateColumn()
    @Field(type=>String)
    createdAt:string

    @UpdateDateColumn()
    @Field(type=>String)
    updatedAt:string
}