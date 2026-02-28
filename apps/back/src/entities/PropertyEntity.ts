import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";
import { PropertyModel } from "@kissnotes/types";

@Entity({ name: "properties" })
export default class PropertyEntity
  extends AbstractEntity
  implements PropertyModel
{
  @Column()
  name!: string;

  @Column()
  group!: string;

  @OneToMany(() => ExpressionEntity, (expression) => expression.property)
  expressions!: ExpressionEntity[];
}
