"use client";

import { AuthLayout } from "@/components/admin/auth/AuthLayout";
import { ParticipantsList } from "@/components/admin/home/ParticipantsList";
import AdminNavigator from "@/components/admin/navigation/AdminNavigator";
import { BasicSiteLayout } from "@/components/general/layouts/BasicSiteLayout";
import { useAdminData } from "@/hooks/useAdminData";

export default function AdminPage() {
  const { data, loading } = useAdminData();

  console.log(data);

  if (loading) {
    return (
      <AuthLayout title="IQS">
        <p className="text-center text-gray-400">Loading...</p>
      </AuthLayout>
    );
  }

  return (
    <BasicSiteLayout>
      <AdminNavigator title={"Admin Dashboard"} />
      <ParticipantsList participants={data?.participants} />
    </BasicSiteLayout>
  );
}
