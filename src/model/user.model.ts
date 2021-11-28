import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Issue } from "./issue.model";
import { Workspace } from "./workspace.model";

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

    @ManyToMany(type => Workspace, workspace => workspace.users, {eager: true})
    @JoinTable()
    workspaces!: Workspace[]

    @OneToMany(type => Issue, issue => issue.author, {eager: true, cascade: true})
    @JoinTable()
    issues!: Issue[]
}