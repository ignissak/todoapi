import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IssueState } from "./enums/issue.state";
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

    @ManyToOne(type => Workspace, workspace => workspace.issues, {lazy: true})
    workspace!: Promise<Workspace>;

    @ManyToOne(type => User, user => user.issues, {lazy: true})
    author!: Promise<User>;

    @Column({default: false})
    archived!: boolean;

    @Column({
        type: "enum",
        enum: IssueState,
        default: IssueState.OPEN
    })
    state!: IssueState

}