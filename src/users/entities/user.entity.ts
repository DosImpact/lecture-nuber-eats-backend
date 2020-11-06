import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";


/**
 * id , createdAt, updatedAt ( 모든 entity의 디폴트)
 * email, password, role(client,owner,delivery)
 * 
 */
type UserRole = "client" | "owner" | "delivery";

@Entity()
export class User extends CoreEntity {

    @Column()
    email:string

    @Column()
    password:string
    
    @Column()
    role:UserRole

}