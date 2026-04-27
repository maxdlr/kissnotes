"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";
import useAuth from "@/contexts/AuthContext/useAuth";
import { getUsername } from "@/utils/userUtils";

const UserProfileHeader = () => {
  const { isAuthUser } = useAuth();
  const { handle } = useParams();
  const router = useRouter();

  return <div className="flex justify-between items-center"></div>;
};

export default UserProfileHeader;
