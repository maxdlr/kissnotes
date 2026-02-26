import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import User from "./User";
import { ExpressionModel } from "@kissnotes/types";

@Entity()
// @TableInheritance({ column: { type: "varchar", name: "type" } })
export default class ExpressionEntity
  extends AbstractEntity
  implements ExpressionModel
{
  @Column()
  title!: string;

  @Column()
  description?: string;

  @ManyToOne(() => User, (user) => user.expressions)
  user!: User;
}
