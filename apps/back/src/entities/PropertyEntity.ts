import { PropertyModel } from "@kissnotes/types";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";

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
