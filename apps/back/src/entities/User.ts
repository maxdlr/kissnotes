import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./Expression";

@Entity()
// @TableInheritance({ column: { type: "varchar", name: "type" } })
export default class User extends AbstractEntity {
  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @OneToMany(() => ExpressionEntity, (expression) => expression.user)
  expressions!: ExpressionEntity[];
}
