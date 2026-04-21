import React from "react";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, Shield, Loader, Wifi, WifiOff } from "lucide-react";

const mockAccounts = [
  { 
    id: 1, 
    email: "mohamedhasabelnaby@gmail.com", 
    provider: "Google", 
    emails: "12,450", 
    threats: "23", 
    sync: "2 Min ago", 
    status: "Connected", 
    statusColor: "text-[#689300]",
    icon: 'wifi' 
  },
  { 
    id: 2, 
    email: "mohamedMostafa23@hotmail.com", 
    provider: "Hotmail", 
    emails: "11,600", 
    threats: "15", 
    sync: "2 Days ago", 
    status: "Connected", 
    statusColor: "text-[#689300]", 
    icon: 'wifi' 
  },
  { 
    id: 3, 
    email: "mohamedhasabelnaby@gmail.com", 
    provider: "Custom IMAP", 
    emails: "13,050", 
    threats: "9", 
    sync: "Syncing...", 
    status: "", 
    statusColor: "text-primary-400", 
    icon: 'loader' 
  },
  { 
    id: 4, 
    email: "Personal@Proton.me", 
    provider: "ProtonMail", 
    emails: "12,325", 
    threats: "2", 
    sync: "5 Min ago", 
    status: "DisConnected", 
    statusColor: "text-[#E7020C]", 
    icon: 'wifioff' 
  },
];

interface ConnectedAccountsProps {
  onAddAccount: () => void;
}

export function ConnectedAccounts({ onAddAccount }: ConnectedAccountsProps) {
  return (
    <div className="flex flex-col w-full min-h-screen p-10 lg:p-12 transition-all duration-300">
      
      <div className="flex justify-between items-center mb-8 w-full mt-2">
        <div className="flex flex-col gap-1">
          <Text as="h2" size="2xl" font="semiBold" className="text-primary-900 tracking-tight">Connected Accounts</Text>
          <Text size="sm" className="text-primary-400">You have Total 4 connected accounts</Text>
        </div>
        <Button 
          className="w-auto bg-primary-900 text-primary-50 hover:bg-primary-800 rounded-[12px] px-6 h-11 font-medium transition-all"
          onClick={onAddAccount}
        >
          Add New Account +
        </Button>
      </div>

      <div className="bg-primary-50 rounded-[32px] p-6 lg:p-8 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {mockAccounts.map(acc => (
          <div key={acc.id} className="border border-primary-100/60 rounded-[20px] p-6 lg:p-8 bg-card flex flex-col gap-8 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                <div className="w-[46px] h-[46px] min-w-[46px] rounded-2xl bg-primary-50/80 flex items-center justify-center border border-primary-100/50">
                  <Mail className="w-5 h-5 text-black stroke-[1.5]" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <div className="truncate w-full">
                    <Text size="sm" font="semiBold" className="text-primary-900 tracking-tight truncate w-full block">{acc.email}</Text>
                  </div>
                  <Text size="xs" className="text-primary-500 font-medium">{acc.provider}</Text>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${acc.statusColor} pt-1 shrink-0`}>
                {acc.icon === 'loader' && <Loader className="w-4 h-4 text-primary-400 animate-spin" />}
                {acc.icon === 'wifi' && <Wifi className="w-4 h-4" />}
                {acc.icon === 'wifioff' && <WifiOff className="w-4 h-4" />}
                {acc.status}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1">
                <Text size="2xl" className="text-[#0280B6] tracking-tight" font="bold">{acc.emails}</Text>
                <Text size="xs" className="text-primary-400 mt-1 font-medium">Total Emails</Text>
              </div>
              
              <div className="w-[1px] h-12 bg-primary-100"></div>

              <div className="flex flex-col items-center flex-1">
                <Text size="2xl" className="text-[#E7020C] tracking-tight" font="bold">{acc.threats}</Text>
                <Text size="xs" className="text-primary-400 mt-1 font-medium">Threats</Text>
              </div>
              
              <div className="w-[1px] h-12 bg-primary-100"></div>

              <div className="flex flex-col items-center flex-1">
                {acc.sync === "Syncing..." ? (
                  <Text size="xl" className="text-primary-800 tracking-tight" font="bold">Syncing...</Text>
                ) : (
                  <Text size="xl" className="text-primary-800 tracking-tight" font="bold">
                    {acc.sync}
                  </Text>
                )}
                <Text size="xs" className="text-primary-400 mt-1 font-medium">Last sync</Text>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-full h-[42px] border-primary-200 text-primary-700 font-medium hover:bg-primary-50 transition-colors shadow-sm bg-card">
                Sync <RefreshCw className="w-[18px] h-[18px] ml-2 text-primary-500 stroke-[2]"/>
              </Button>
              <Button variant="outline" className="flex-1 rounded-full h-[42px] border-primary-200 text-primary-700 font-medium hover:bg-primary-50 transition-colors shadow-sm bg-card">
                Scan <Shield className="w-[18px] h-[18px] ml-2 text-primary-500 stroke-[2]"/>
              </Button>
            </div>

          </div>
        ))}
        </div>
      </div>
      
    </div>
  );
}