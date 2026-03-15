"use client";
import type { ExpressionModel } from "@kissnotes/types";
import { getRelativeTime } from "@/utils/dateUtils";
import { truncate } from "@/utils/stringUtils";
import TokenPill from "../ExpressionToken/ExpressionToken";
import { KissCodeBlock } from "../KissCodeBlock";
import { UserHandle } from "../UserHandle";

interface ExpressionCardProps {
	expression: ExpressionModel;
	className?: string;
}
const ExpressionCard = ({ expression, className }: ExpressionCardProps) => {
	const { symbols, title, author, createdAt, description } = expression;
	return (
		<div className={`border border-secondary rounded-3xl p-4 sm:p-8 ${className}`}>
			<div className="grid grid-flow-row-dense gap-2 sm:gap-4">
				<div className="text-sm font-bold flex justify-between items-center text-accent">
					<UserHandle username={author.username} />
					<p>{getRelativeTime(createdAt)}</p>
				</div>
				<div className="text-lg font-bold">
					<p>{title}</p>
				</div>
				{description && (
					<div>
						<p>{truncate(description, 200)}</p>
					</div>
				)}
				<div className="flex overflow-auto justify-items-start items-center gap-2">
					{symbols?.tokens
						?.filter((t) => t.kind === "function")
						.map((t) => (
							<TokenPill token={t} key={t.index} />
						))}
				</div>
				<KissCodeBlock expression={expression} />
			</div>
		</div>
	);
};
export default ExpressionCard;
