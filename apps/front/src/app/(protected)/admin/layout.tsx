import { ReactNode } from "react";

const AdminLayout = ({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) => {
  return (
    <div className="block md:grid md:grid-cols-4 gap-2">
      <div className="col-span-1">{sidebar}</div>
      <div className="col-span-3">{children}</div>
    </div>
  );
};
export default AdminLayout;
