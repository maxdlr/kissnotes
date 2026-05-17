import { SocialLinkModel, SocialType } from "@kissnotes/types";
import { IsNotEmpty, IsUrl } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import UserEntity from "./UserEntity";

@Entity("socialLinks")
export default class SocialLinkEntity
  extends AbstractEntity
  implements SocialLinkModel
{
  @Column({ nullable: false, enum: SocialType, type: "enum" })
  @IsNotEmpty({ message: "Required" })
  name!: SocialType;

  @Column({ nullable: false })
  @IsUrl({}, { message: "It doesn't look like a valid Url" })
  @IsNotEmpty({ message: "Required" })
  url!: string;

  @ManyToOne(() => UserEntity, (user) => user.socials, {
    nullable: false,
  })
  user!: UserEntity;
}
