import {  CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * id , createdAt, updatedAt ( 모든 entity의 디폴트)
 */

@Entity()
export class CoreEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    createdAt:string

    @UpdateDateColumn()
    updatedAt:string
}