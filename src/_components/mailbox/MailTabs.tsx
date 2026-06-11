// "use client";
// import React from "react";
// import { Inbox, Tag, Users } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useMailStore } from "@/stores/useMailStore";
// import { MailList } from "./MailList";
// import { useUnreadEmailsCount } from "@/APIs/hooks/emails";
// import { useParams } from "next/navigation";

// export const MailTabs = () => {
//   const activeClassification = useMailStore((s) => s.activeClassification);
//   const setActiveClassification = useMailStore(
//     (s) => s.setActiveClassification,
//   );

//   const params = useParams();
//   const mailboxId = params.mailboxId as string;
//   const unreadInboxCount = useUnreadEmailsCount(mailboxId, "inbox");

//   const activeFolder = useMailStore((s) => s.activeFolder);

//   if (activeFolder !== "inbox") return null;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 md:mb-6">
//       {tabs.map((tab) => {
//         const isActive = activeClassification === tab.id;
//         const unreadCount = tab.id === "primary" ? unreadInboxCount : 0;

//         return (
//           <React.Fragment key={tab.id}>
//             <button
//               onClick={() => setActiveClassification(tab.id)}
//               className={cn(
//                 "flex items-center gap-2 py-4 px-2 md:px-0 transition-all whitespace-nowrap",
//                 "cursor-pointer md:border-b-2",
//                 !isActive && "border-t md:border-t-0 border-primary-50",
//                 isActive
//                   ? "md:border-secondary-700 text-secondary-800 font-medium bg-secondary-50/50 md:bg-transparent"
//                   : "md:border-transparent text-primary-500 hover:text-primary-700 hover:md:border-primary-200",
//               )}
//             >
//               <tab.icon
//                 className={cn("w-5 h-5", isActive && "text-secondary-800")}
//               />
//               <span className="text-base">{tab.label}</span>
//             </button>

//             {isActive && (
//               <div className="block md:hidden col-span-1 border-t border-primary-50">
//                 <MailList />
//               </div>
//             )}
//           </React.Fragment>
//         );
//       })}
//     </div>
//   );
// };
