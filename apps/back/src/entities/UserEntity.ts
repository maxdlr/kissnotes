import { UserModel } from "@kissnotes/types";
import bcrypt from "bcrypt";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";

@Entity({ name: "users" })
export default class UserEntity extends AbstractEntity implements UserModel {
  @Column({ name: "password", select: false })
  private _password!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @OneToMany(() => ExpressionEntity, (expression) => expression.author)
  expressions!: ExpressionEntity[];

  set password(value: string) {
    this._password = bcrypt.hashSync(value, 10);
  }

  get password() {
    return this._password;
  }
}
