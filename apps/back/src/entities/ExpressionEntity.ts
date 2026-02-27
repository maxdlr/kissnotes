import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import UserEntity from "./UserEntity";
import { ExpressionModel } from "@kissnotes/types";

@Entity({ name: "expressions" })
export default class ExpressionEntity
  extends AbstractEntity
  implements ExpressionModel
{
  @Column()
  title!: string;

  @Column()
  description?: string;

  @ManyToOne(() => UserEntity, (user) => user.expressions, {
    nullable: false,
    eager: true,
  })
  user!: UserEntity;
}
