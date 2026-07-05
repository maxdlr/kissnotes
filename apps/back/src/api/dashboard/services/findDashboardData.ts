import ExpressionRepository from "@/repositories/ExpressionRepository";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";
import SaveRepository from "@/repositories/SaveRepository";
import UserRepository from "@/repositories/UserRepository";
import { DashboardModel } from "@kissnotes/types";

/**
 * Aggregates dashboard statistics from expressions and users tables.
 *
 * @returns Dashboard data with expression and user counts
 */
const findDashboardData = async (): Promise<DashboardModel> => {
  const [
    publishedCount,
    totalExpressionCount,
    nativeCount,
    savedCount,
    viewsAndShares,
    totalUserCount,
    adminCount,
  ] = await Promise.all([
    ExpressionRepository.count({ where: { published: true } }),
    ExpressionRepository.count(),
    NativeExpressionRepository.count(),
    SaveRepository.count(),
    ExpressionRepository.createQueryBuilder("expression")
      .select("COALESCE(SUM(expression.views), 0)", "views")
      .addSelect("COALESCE(SUM(expression.shares), 0)", "shares")
      .getRawOne<{ views: string; shares: string }>(),
    UserRepository.count(),
    UserRepository.count({ where: { type: "admin" } }),
  ]);

  return {
    expressions: {
      publishedCount,
      nativeCount,
      totalCount: totalExpressionCount,
      savedCount,
      sharesCount: Number(viewsAndShares?.shares ?? 0),
      viewsCount: Number(viewsAndShares?.views ?? 0),
    },
    users: {
      totalCount: totalUserCount,
      adminCount,
      userCount: totalUserCount - adminCount,
    },
  };
};

export default findDashboardData;
