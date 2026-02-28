import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import ExpressionEntity from "./ExpressionEntity";
import { LayerModel } from "@kissnotes/types";

@Entity({ name: "layers" })
export default class LayerEntity extends AbstractEntity implements LayerModel {
  @Column()
  name!: string;

  @Column()
  type!: string;

  @OneToMany(() => ExpressionEntity, (expression) => expression.layer)
  expressions!: ExpressionEntity[];
}
