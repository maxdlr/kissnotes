import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";
import { UserModel } from "@kissnotes/types";

@Entity({ name: "users" })
export default class UserEntity extends AbstractEntity implements UserModel {
  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @Column()
  username!: string;

  @OneToMany(() => ExpressionEntity, (expression) => expression.user)
  expressions!: ExpressionEntity[];
}
