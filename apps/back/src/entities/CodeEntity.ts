import { CodeModel } from "@kissnotes/types";
import { Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import LineEntity from "./LineEntity";

@Entity({ name: "codes" })
export default class CodeEntity extends AbstractEntity implements CodeModel {
  @OneToMany(() => LineEntity, (line) => line.code, {
    nullable: false,
    eager: true,
  })
  lines!: LineEntity[];
}
