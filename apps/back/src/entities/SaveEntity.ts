import { Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";
import UserEntity from "./UserEntity";
import { SaveModel } from "@kissnotes/types";

@Entity({ name: "saves" })
export default class SaveEntity extends AbstractEntity implements SaveModel {
  @ManyToOne(() => UserEntity, (user) => user.saves, {
    nullable: false,
    eager: true,
  })
  user!: UserEntity;

  @ManyToOne(() => ExpressionEntity, (expression) => expression.saves, {
    nullable: false,
    eager: true,
  })
  expression!: ExpressionEntity;
}
