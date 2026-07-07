import Button from "@/components/Button";
import KissCodeBlock from "@/components/KissCodeBlock";
import Pill from "@/components/Pill";
import Tooltip from "@/components/Tooltip";
import UserHandle from "@/components/UserHandle";
import useAuth from "@/contexts/AuthContext/useAuth";
import useExpressions from "@/hooks/useExpressions";
import {
  CheckBadgeIcon,
  EyeIcon,
  BookmarkIcon as OutlineBookmark,
  PencilIcon,
  PencilSquareIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookmark } from "@heroicons/react/24/solid";
import { ExpressionModel, ExpressionToken, Id } from "@kissnotes/types";
import { useMemo, useState } from "react";

export interface ExpressionDetailsContentProps {
  expression: ExpressionModel & { native?: boolean };
  onSave?: () => void;
  onEdit?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  preview?: boolean;
}

const ExpressionDetailsContent = ({
  expression,
  onSave,
  onEdit,
  onPublish,
  onUnpublish,
  preview = false,
}: ExpressionDetailsContentProps) => {
  const { getTokens } = useExpressions(expression || []);

  const tokens = getTokens(["properties", "methods", "functions"]);
  const [highlightedTokens, setHighlightedTokens] = useState<string[]>([]);
  const [hoveredToken, setHoveredToken] = useState<ExpressionToken>();
  const auth = useAuth();

  const handleHighlightToken = (token: string) => {
    if (highlightedTokens.includes(token)) {
      setHighlightedTokens((prev) => prev.filter((t) => t !== token));
    } else {
      setHighlightedTokens((prev) => [...prev, token]);
    }
  };

  const handleHoverStart = (token: ExpressionToken) => {
    setHoveredToken(token);
  };

  const handleHoverEnd = () => {
    setHoveredToken(undefined);
  };

  const isSaved = useMemo(() => {
    const saves = auth?.user?.saves as Id[];
    if (!saves) return false;
    if (expression.native) {
      return saves.includes(`native:${expression.id}`);
    }
    return saves.includes(expression.id);
  }, [auth?.user?.saves, expression.id, expression.native]);

  console.log(
    expression.author?.username,
    expression.views,
    expression.shares,
    expression.native,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:gap-8">
      {(!!expression.author?.username ||
        !!expression.views ||
        !!expression.shares ||
        !!expression.native ||
        !!expression.saves) && (
        <div className="flex justify-start items-center gap-4 col-span-1 md:col-span-full">
          {expression.author && (
            <UserHandle username={expression.author.username} />
          )}
          {expression.author && <span className="text-secondary">•</span>}
          {!expression.native && (
            <Button
              variant="ghost"
              Icon={ShareIcon}
              label={expression.shares}
            />
          )}
          <Button
            variant="ghost"
            Icon={
              !auth?.user
                ? OutlineBookmark
                : isSaved
                  ? SolidBookmark
                  : OutlineBookmark
            }
            label={String(expression.saves || 0)}
            onClick={onSave}
            disabled={!auth?.user}
          />
          {!expression.native && (
            <Button
              variant="ghost"
              Icon={EyeIcon}
              label={expression.views}
              disabled={true}
            />
          )}
        </div>
      )}

      <div className="col-span-1 md:col-span-full flex items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-4">
          {expression.title && (
            <h1 className="text-2xl font-bold">{expression.title}</h1>
          )}
          {!expression?.published && !Boolean(!preview) && (
            <Pill label="Draft" className="border-emphasis text-emphasis" />
          )}
          {!!preview && (
            <Pill label="Preview" className="border-emphasis text-emphasis" />
          )}
        </div>
        {auth?.user && auth?.isAuthUser(expression.author) && (
          <div className={`flex items-center justify-center gap-4`}>
            {(onEdit || onPublish) && (
              <>
                {onEdit && (
                  <Button
                    label="Edit"
                    Icon={PencilIcon}
                    variant="outline"
                    onClick={onEdit}
                  />
                )}
                {!expression?.published && onPublish && (
                  <Button
                    label="Publish"
                    Icon={CheckBadgeIcon}
                    variant="fill"
                    onClick={onPublish}
                  />
                )}
              </>
            )}
            {expression?.published && onUnpublish && (
              <Button
                label="Unpublish"
                variant="outline"
                Icon={PencilSquareIcon}
                onClick={onUnpublish}
              />
            )}
          </div>
        )}
      </div>

      {/* <LayerMockup */}
      {/*   layer={expression.layer} */}
      {/*   property={expression.property} */}
      {/*   className={`col-span-full ${expression.symbols ? "md:col-span-1" : ""}`} */}
      {/* /> */}

      {expression.symbols && (
        <div className="space-y-2 colspan-full md:col-span-1">
          <div className="flex flex-wrap justify-start items-center gap-2">
            <div className="flex gap-2">
              <h3 className="text-lg font-semibold text-accent">Tokens</h3>
              <Tooltip content="Highlights from the expression." />
            </div>
            {!!tokens.length && <span className="text-secondary px-2">•</span>}
            {tokens.map((t) => (
              <Button
                onHoverStart={() => handleHoverStart(t)}
                onHoverEnd={handleHoverEnd}
                tooltip={{ content: t.description || "", showDelay: 500 }}
                key={t.id}
                variant="ghost"
                label={
                  <Pill
                    label={t.label}
                    className={`hover:text-white hover:border-emphasis/80 ${highlightedTokens.includes(t.title) ? "border-emphasis text-emphasis" : ""}`}
                  />
                }
                className={`text-secondary! ${
                  highlightedTokens.includes(t.title) ? "bg-accent" : ""
                }`}
                onClick={() => handleHighlightToken(t.title)}
              />
            ))}
          </div>
        </div>
      )}

      <KissCodeBlock
        enableCopy
        enableLineCopy
        expression={expression}
        highlightedTokens={highlightedTokens}
        highlightedLines={hoveredToken?.line}
        className="col-span-1 md:col-span-full"
      />

      {expression.description && (
        <div className="space-y-2 col-span-full">
          <h3 className="text-lg font-semibold text-accent">Description</h3>
          <p>{expression.description}</p>
        </div>
      )}
    </div>
  );
};
export default ExpressionDetailsContent;
