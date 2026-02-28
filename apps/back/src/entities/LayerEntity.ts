import { LayerModel } from "@kissnotes/types";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";

@Entity({ name: "layers" })
export default class LayerEntity extends AbstractEntity implements LayerModel {
  @Column()
  name!: string;

  @Column()
  type!: string;

  @OneToMany(() => ExpressionEntity, (expression) => expression.layer)
  expressions!: ExpressionEntity[];
}
