import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Issue } from "./issue.model";
import { User } from "./user.model";

@Entity({name: "workspaces"})
export class Workspace {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @OneToMany(type => Issue, issue => issue.workspace, {eager: true, cascade: true})
    issues!: Issue[];

    @ManyToMany(type => User, user => user.workspaces, {lazy: true})
    users!: Promise<User[]>;
}