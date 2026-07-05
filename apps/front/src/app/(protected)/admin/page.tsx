"use client";
import Loading from "@/components/Loading";
import MasonryGrid from "@/components/MasonryGrid";
import type { DashboardModel } from "@kissnotes/types";
import useSWR from "swr";

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="border border-accent rounded-2xl p-4 sm:p-6 space-y-2">
    <p className="text-sm text-accent font-semibold">{label}</p>
    <p className="text-2xl sm:text-3xl font-bold">{value.toLocaleString()}</p>
  </div>
);

const AdminPage = () => {
  const { data, isLoading } = useSWR<DashboardModel>({
    url: "/dashboard/browse",
    params: {},
  });

  if (isLoading || !data) return <Loading />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-accent">Expressions</h2>
        <MasonryGrid columns={{ 0: 2, 640: 3 }}>
          <StatCard label="Published" value={data.expressions.publishedCount} />
          <StatCard label="Native" value={data.expressions.nativeCount} />
          <StatCard label="Total" value={data.expressions.totalCount} />
          <StatCard label="Saves" value={data.expressions.savedCount} />
          <StatCard label="Views" value={data.expressions.viewsCount} />
          <StatCard label="Shares" value={data.expressions.sharesCount} />
        </MasonryGrid>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-accent">Users</h2>
        <MasonryGrid columns={{ 0: 2, 640: 3 }}>
          <StatCard label="Total" value={data.users.totalCount} />
          <StatCard label="Admins" value={data.users.adminCount} />
          <StatCard label="Users" value={data.users.userCount} />
        </MasonryGrid>
      </div>
    </div>
  );
};

export default AdminPage;
