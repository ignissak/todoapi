import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";
import { Workspace } from "./workspace.model";

@Entity({name: "issues"})
export class Issue {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    text!: string;

    @Column()
    deadline!: Date;

    @ManyToOne(type => Workspace, workspace => workspace.issues)
    workspace!: Workspace;

    @ManyToOne(type => User, user => user.issues)
    author!: User;

    @Column({default: false})
    archived!: boolean;

}