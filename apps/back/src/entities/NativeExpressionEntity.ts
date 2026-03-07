import { NativeExpressionModel } from "@kissnotes/types";
import { Column, Entity } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";

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
}
