"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/_components/shared/Text";
import { getInitials, getImageUrl } from "@/lib/utils";
import { AuthMe } from "@/APIs/types/auth";
import { Calendar, Edit2, Mail, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  user: AuthMe["user"];
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-background border border-primary-100 p-8 shadow-sm">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary-50/50 blur-3xl" />
      
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl ring-1 ring-primary-100">
            <AvatarImage 
              src={getImageUrl(user.avatar)} 
              alt={user.username} 
              className="object-cover"
            />
            <AvatarFallback className="bg-primary-100 text-primary-800 text-3xl font-bold">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          {user.isVerified && (
            <div className="absolute bottom-1 right-1 bg-secondary-800 p-1.5 rounded-full border-2 border-background text-white shadow-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </motion.div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
            <Text size="32" font="bold" color="primary-950">
              {user.username}
            </Text>
            <div className="px-3 py-1 rounded-full bg-primary-100/50 text-primary-800 text-xs font-semibold uppercase tracking-wider">
              {user.role}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Active
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-2 text-primary-500">
              <Mail className="w-4 h-4" />
              <Text size="sm">{user.email}</Text>
            </div>
            <div className="flex items-center gap-2 text-primary-400">
              <Calendar className="w-4 h-4" />
              <Text size="xs">Member since {format(new Date(user.createdAt), "MMMM yyyy")}</Text>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/settings"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-950/20 active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              <Text font="medium" color="white">Edit Profile</Text>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
