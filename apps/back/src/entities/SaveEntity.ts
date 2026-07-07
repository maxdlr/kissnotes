import { Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";
import NativeExpressionEntity from "./NativeExpressionEntity";
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
    nullable: true,
    eager: true,
  })
  expression?: ExpressionEntity;

  @ManyToOne(
    () => NativeExpressionEntity,
    (nativeExpression) => nativeExpression.saves,
    {
      nullable: true,
      eager: true,
    },
  )
  nativeExpression?: NativeExpressionEntity;
}
