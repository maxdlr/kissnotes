"use client";
import AdminList from "@/components/AdminList";
import useBrowse from "@/hooks/bread/useBrowse";
import { Model } from "@kissnotes/types";
import { useParams } from "next/navigation";

const AdminListPage = () => {
  const { entity } = useParams();
  const { data: entities } = useBrowse<Model[]>(entity as string);
  return <AdminList entities={entities || []} entity={entity as string} />;
};
export default AdminListPage;
