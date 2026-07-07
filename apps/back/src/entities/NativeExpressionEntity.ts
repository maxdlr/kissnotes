import { CodeModel, NativeExpressionModel } from "@kissnotes/types";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import SaveEntity from "./SaveEntity";

@Entity({ name: "nativeExpressions" })
export default class NativeExpressionEntity
  extends AbstractEntity
  implements NativeExpressionModel
{
  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false, length: 2000 })
  description!: string;

  @Column({ nullable: false })
  regex!: string;

  @Column({ nullable: false })
  arguments!: string;

  @Column({ type: "json", nullable: true })
  code?: CodeModel;

  @OneToMany(() => SaveEntity, (save) => save.nativeExpression)
  saves!: SaveEntity[];
}
