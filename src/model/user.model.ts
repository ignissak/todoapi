import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExclusionMetadata } from "typeorm/metadata/ExclusionMetadata";
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

    @ManyToMany(type => Workspace, workspace => workspace.users)
    @JoinTable()
    workspaces!: Workspace[];

    @OneToMany(type => Issue, issue => issue.author)
    issues!: Issue[];
}