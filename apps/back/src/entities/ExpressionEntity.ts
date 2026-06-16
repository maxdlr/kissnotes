import type {
  CodeModel,
  ExpressionModel,
  ExpressionSymbol,
  LayerModel,
  PropertyModel,
} from "@kissnotes/types";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import UserEntity from "./UserEntity";
import SaveEntity from "./SaveEntity";

@Entity({ name: "expressions" })
export default class ExpressionEntity
  extends AbstractEntity
  implements ExpressionModel
{
  @Column({ nullable: false })
  title!: string;

  @Column({ length: 2000 })
  description?: string;

  @ManyToOne(() => UserEntity, (user) => user.expressions, {
    nullable: false,
    eager: true,
  })
  author!: UserEntity;

  @Column({ type: "json" })
  code!: CodeModel;

  @Column({ type: "json" })
  layer!: LayerModel;

  @Column({ type: "json" })
  property!: PropertyModel;

  @Column({ type: "json" })
  symbols?: ExpressionSymbol;

  @Column({ nullable: false, default: 1 })
  views!: number;

  @Column({ nullable: false, default: 0 })
  shares!: number;

  @Column({ nullable: false, default: false })
  published!: boolean;

  @OneToMany(() => SaveEntity, (save) => save.expression)
  saves!: SaveEntity[];
}
