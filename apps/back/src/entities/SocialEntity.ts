import { SocialLinkModel, SocialType } from "@kissnotes/types";
import { IsNotEmpty, IsUrl, ValidationOptions } from "class-validator";
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
  @IsUrl({}, {
    message: "It doesn't look like a valid Url",
  } as ValidationOptions)
  // @IsNotEmpty({
  //   message: ({ object, property }) => {
  //     console.log("Validation error for object:", object, property);
  //     return "Required";
  //   },
  // } as ValidationOptions)
  url!: string;

  @ManyToOne(() => UserEntity, (user) => user.socials, {
    nullable: false,
  })
  user!: UserEntity;
}
