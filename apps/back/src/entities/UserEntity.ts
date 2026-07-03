import { UserModel } from "@kissnotes/types";
import bcrypt from "bcrypt";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";
import SocialLinkEntity from "./SocialEntity";
import SaveEntity from "./SaveEntity";

@Entity({ name: "users" })
export default class UserEntity extends AbstractEntity implements UserModel {
  @Column({ name: "password", select: false })
  private _password!: string;

  @Column({ unique: true })
  @MinLength(3, { message: "Too short! Minimum is 3 characters" })
  @IsNotEmpty({ message: "Required" })
  username!: string;

  @Column({ unique: true })
  @IsEmail({}, { message: "Doesn't look like an email" })
  email!: string;

  @Column({ default: "", length: 2000 })
  description?: string;

  @OneToMany(() => ExpressionEntity, (expression) => expression.author)
  expressions!: ExpressionEntity[];

  @OneToMany(() => SocialLinkEntity, (social) => social.user, { eager: true })
  socials!: SocialLinkEntity[];

  @OneToMany(() => SaveEntity, (save) => save.user)
  saves!: SaveEntity[];

  @Column({ nullable: false, default: "user" })
  type!: "user" | "admin";

  set password(value: string) {
    this._password = bcrypt.hashSync(value, 10);
  }

  get password() {
    return this._password;
  }
}
