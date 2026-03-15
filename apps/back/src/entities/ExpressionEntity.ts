import type { ExpressionModel, ParsedExpression } from "@kissnotes/types";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "./AbstractEntity";
import CodeEntity from "./CodeEntity";
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

	@ManyToOne(
		() => UserEntity,
		(user) => user.expressions,
		{
			nullable: false,
			eager: true,
		},
	)
	author!: UserEntity;

	@OneToOne(() => CodeEntity, {
		nullable: false,
		eager: true,
	})
	@JoinColumn()
	code!: CodeEntity;

	@ManyToOne(
		() => LayerEntity,
		(layer: PropertyEntity) => layer.expressions,
		{
			nullable: false,
			eager: true,
		},
	)
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

	symbols?: ParsedExpression;
}
