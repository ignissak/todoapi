import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ExclusionMetadata } from "typeorm/metadata/ExclusionMetadata";

@Entity({name: "users"})
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

}