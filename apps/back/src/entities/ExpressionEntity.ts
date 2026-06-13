import type {
  CodeModel,
  ExpressionModel,
  ExpressionSymbol,
} from "@kissnotes/types";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import LayerEntity from "./LayerEntity";
import PropertyEntity from "./PropertyEntity";
import UserEntity from "./UserEntity";

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

  @ManyToOne(() => LayerEntity, (layer: PropertyEntity) => layer.expressions, {
    nullable: false,
    eager: true,
  })
  layer!: LayerEntity;

  @ManyToOne(
    () => PropertyEntity,
    (property: PropertyEntity) => property.expressions,
    {
      nullable: false,
      eager: true,
    },
  )
  property!: PropertyEntity;

  @Column({ type: "json" })
  symbols?: ExpressionSymbol;
}
