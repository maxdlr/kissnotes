import { LineModel } from "@kissnotes/types";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import CodeEntity from "./CodeEntity";

@Entity({ name: "lines" })
export default class LineEntity extends AbstractEntity implements LineModel {
  @Column()
  number!: number;

  @Column()
  content!: string;

  @ManyToOne(() => CodeEntity)
  code!: CodeEntity;
}
