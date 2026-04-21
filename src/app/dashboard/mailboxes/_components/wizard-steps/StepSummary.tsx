"use client";

import React, { useState } from "react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import { Mail, Settings, Rocket, Eye, EyeOff, ChevronDown, ChevronRight, X, Pencil } from "lucide-react";
import { WizardStepProps } from "./WizardTypes";

export function StepSummary({ formData = {} as any, handleChange = () => {} }: WizardStepProps) {
  const [editMailbox, setEditMailbox] = useState(false);
  const [editImap, setEditImap] = useState(false);
  const [editSmtp, setEditSmtp] = useState(false);
  const [editAdvanced, setEditAdvanced] = useState(false);
  const [showSummarySyncDropdown, setShowSummarySyncDropdown] = useState(false);
  const [showImapPassword, setShowImapPassword] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center text-left">
      <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">Summary</Text>
      <Text size="sm" font="normal" className="text-primary-400 text-center mb-14 tracking-wide">Please review your data before confirming</Text>

      <div className="w-full max-w-[900px] flex flex-col mx-auto bg-card mb-8">
        {/* Mailbox Name Block */}
        <div className="flex flex-col py-8 border-b border-primary-100">
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-2.5 text-[#689300] font-bold text-[16px]">
              <Mail className="w-5 h-5 stroke-[2.5]" /> Mailbox Name
            </div>
            {editMailbox ? (
              <Button variant="default" onClick={() => setEditMailbox(false)} className="w-[140px] flex-shrink-0 bg-error-600 hover:bg-error-700 text-white h-10 gap-2 px-3 rounded-[6px] text-sm font-semibold shadow-none">
                <X className="w-4 h-4 stroke-[3]" /> Cancel Editing
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setEditMailbox(true)} className="w-[84px] flex-shrink-0 h-10 gap-2 px-3 rounded-[6px] text-primary-700 border-primary-200 hover:bg-primary-50 text-sm font-semibold shadow-none">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
            )}
          </div>
          {editMailbox ? (
            <div className="grid grid-cols-4 gap-6 w-full">
              <div className="col-span-1"><Input label="Mailbox Name" required value={formData.mailboxName} onChange={(e: any) => handleChange('mailboxName', e.target.value)} /></div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6 w-full">
              <div>
                <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Mailbox Name</div>
                <div className="text-[15px] font-bold text-primary-900 tracking-tight">{formData.mailboxName || 'MO'}</div>
              </div>
              <div>
                <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Email Address</div>
                <div className="text-[15px] font-bold text-primary-900 tracking-tight">mohamed@yahoo.com</div>
              </div>
            </div>
          )}
        </div>

        {/* IMAP Config Block */}
        <div className="flex flex-col py-8 border-b border-primary-100">
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-2.5 text-[#689300] font-bold text-[16px]">
              <Settings className="w-5 h-5 stroke-[2.5]" /> IMAP Config
            </div>
            {editImap ? (
              <Button variant="default" onClick={() => setEditImap(false)} className="w-[140px] flex-shrink-0 bg-error-600 hover:bg-error-700 text-white h-10 gap-2 px-3 rounded-[6px] text-sm font-semibold shadow-none">
                <X className="w-4 h-4 stroke-[3]" /> Cancel Editing
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setEditImap(true)} className="w-[84px] flex-shrink-0 h-10 gap-2 px-3 rounded-[6px] text-primary-700 border-primary-200 hover:bg-primary-50 text-sm font-semibold shadow-none">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
            )}
          </div>
          {editImap ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-4 gap-6 w-full">
                <div><Input label="IMAP Host" value={formData.imapHost} onChange={(e: any) => handleChange("imapHost", e.target.value)} /></div>
                <div><Input label="Port" value={formData.imapPort} onChange={(e: any) => handleChange("imapPort", e.target.value)} /></div>
                <div>
                  <label className="block text-[13px] text-primary-400 mb-1.5 font-normal">Security</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 border border-primary-100 rounded-[12px] outline-none appearance-none focus:border-primary-400 text-primary bg-card" value={formData.imapSecurity} onChange={(e: any) => handleChange("imapSecurity", e.target.value)}>
                      <option>SSL/TLS</option><option>STARTTLS</option><option>None</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
                  </div>
                </div>
                <div><Input label="Username" value={formData.imapUsername} onChange={(e: any) => handleChange("imapUsername", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-4 gap-6 w-full">
                <div><Input type="password" label="Password" placeholder="••••••••" value={formData.imapPassword || ''} onChange={(e: any) => handleChange("imapPassword", e.target.value)} /></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-4 gap-6 w-full">
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">IMAP Host</div>
                  <div className="text-[15px] font-normal text-primary-900">{formData.imapHost || 'Imap.Company.Com'}</div>
                </div>
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Port</div>
                  <div className="text-[15px] font-normal text-primary-900">{formData.imapPort || '995'}</div>
                </div>
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Security</div>
                  <div className="text-[15px] font-normal text-primary-900">{formData.imapSecurity || 'SSL/TLS'}</div>
                </div>
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Username</div>
                  <div className="text-[15px] font-normal text-primary-900">{formData.imapUsername || 'Mohamed'}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 w-full">
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Password</div>
                  <div className="flex items-center gap-3">
                    <div className={showImapPassword ? "text-[15px] font-normal text-primary-900 pt-1" : "text-[24px] leading-none tracking-widest text-primary-900 pt-2"}>
                      {showImapPassword ? (formData.imapPassword || 'Not Set') : '••••••'}
                    </div>
                    {showImapPassword ? (
                      <EyeOff className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1" onClick={() => setShowImapPassword(false)} />
                    ) : (
                      <Eye className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1" onClick={() => setShowImapPassword(true)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SMTP Config Block */}
        <div className="flex flex-col py-8 border-b border-primary-100">
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-2.5 text-[#689300] font-bold text-[16px]">
              <Settings className="w-5 h-5 stroke-[2.5]" /> SMTP Config
            </div>
            {editSmtp ? (
              <Button variant="default" onClick={() => setEditSmtp(false)} className="w-[140px] flex-shrink-0 bg-error-600 hover:bg-error-700 text-white h-10 gap-2 px-3 rounded-[6px] text-sm font-semibold shadow-none">
                <X className="w-4 h-4 stroke-[3]" /> Cancel Editing
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setEditSmtp(true)} className="w-[84px] flex-shrink-0 h-10 gap-2 px-3 rounded-[6px] text-primary-700 border-primary-200 hover:bg-primary-50 text-sm font-semibold shadow-none">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
            )}
          </div>
          {editSmtp ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-4 gap-6 w-full">
                <div><Input label="SMTP Host" value={formData.smtpHost} onChange={(e: any) => handleChange("smtpHost", e.target.value)} /></div>
                <div><Input label="Port" value={formData.smtpPort} onChange={(e: any) => handleChange("smtpPort", e.target.value)} /></div>
                <div>
                  <label className="block text-[13px] text-primary-400 mb-1.5 font-normal">Security</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 border border-primary-100 rounded-[12px] outline-none appearance-none focus:border-primary-400 text-primary bg-card" value={formData.smtpSecurity} onChange={(e: any) => handleChange("smtpSecurity", e.target.value)}>
                      <option>SSL/TLS</option><option>STARTTLS</option><option>None</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
                  </div>
                </div>
                <div><Input label="Username" value={formData.smtpUsername} onChange={(e: any) => handleChange("smtpUsername", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-4 gap-6 w-full">
                <div><Input type="password" label="App Password" placeholder="••••••••" value={formData.smtpPassword || ''} onChange={(e: any) => handleChange("smtpPassword", e.target.value)} /></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-4 gap-6 w-full">
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">SMTP Host</div>
                  <div className="text-[15px] font-normal text-primary-900">{formData.smtpHost || 'Imap.Company.Com'}</div>
                </div>
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Port</div>
                  <div className="text-[15px] font-normal text-primary-900">{formData.smtpPort || '995'}</div>
                </div>
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Security</div>
                  <div className="text-[15px] font-normal text-primary-900">{formData.smtpSecurity || 'SSL/TLS'}</div>
                </div>
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Username</div>
                  <div className="text-[15px] font-normal text-primary-900">{formData.smtpUsername || 'Mohamed'}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6 w-full">
                <div>
                  <div className="text-[13px] text-primary-400 mb-1.5 font-medium">App Password</div>
                  <div className="flex items-center gap-3">
                    <div className={showSmtpPassword ? "text-[15px] font-normal text-primary-900 pt-1" : "text-[24px] leading-none tracking-widest text-primary-900 pt-2"}>
                      {showSmtpPassword ? (formData.smtpPassword || 'Not Set') : '••••••'}
                    </div>
                    {showSmtpPassword ? (
                      <EyeOff className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1" onClick={() => setShowSmtpPassword(false)} />
                    ) : (
                      <Eye className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1" onClick={() => setShowSmtpPassword(true)} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Settings Block */}
        <div className="flex flex-col py-8 pb-16">
          <div className="flex justify-between items-center w-full mb-6">
            <div className="flex items-center gap-2.5 text-primary-700 font-bold text-[16px]">
              <Rocket className="w-5 h-5 stroke-[2.5] text-[#689300]" /> Advanced Settings
            </div>
            {editAdvanced ? (
              <Button variant="default" onClick={() => setEditAdvanced(false)} className="w-[140px] flex-shrink-0 bg-error-600 hover:bg-error-700 text-white h-10 gap-2 px-3 rounded-[6px] text-sm font-semibold shadow-none">
                <X className="w-4 h-4 stroke-[3]" /> Cancel Editing
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setEditAdvanced(true)} className="w-[84px] flex-shrink-0 h-10 gap-2 px-3 rounded-[6px] text-primary-700 border-primary-200 hover:bg-primary-50 text-sm font-semibold shadow-none">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
            )}
          </div>
          {editAdvanced ? (
            <div className="grid grid-cols-4 gap-6 w-full">
              <div>
                <label className="block text-[13px] text-primary-400 mb-1.5 font-normal">Sync Interval (Minutes)</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSummarySyncDropdown(!showSummarySyncDropdown)}
                    className="w-full h-[52px] flex items-center justify-between px-5 border border-primary-200 rounded-[16px] outline-none text-primary bg-card hover:border-primary-300 transition-colors"
                  >
                    <span className="text-[14px] font-medium text-primary-700">
                      {formData.syncInterval ? (formData.syncInterval === "5" ? "Every 5 Minutes" : `${formData.syncInterval} Minutes`) : "Select From The List"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform duration-200 ${showSummarySyncDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showSummarySyncDropdown && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-primary-50 rounded-[16px] z-50 flex flex-col p-2 gap-1 animate-in fade-in zoom-in-95 duration-150 shadow-sm border border-primary-100">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { handleChange("syncInterval", i.toString()); setShowSummarySyncDropdown(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-[12px] transition-colors hover:bg-primary-200/60 ${formData.syncInterval === i.toString() ? 'bg-primary-200/40 text-primary-900' : 'text-primary-500'}`}
                        >
                          <span className="text-[14px] font-medium">
                            {i} Minutes
                          </span>
                          <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6 w-full">
              <div>
                <div className="text-[13px] text-primary-400 mb-1.5 font-medium">Sync Interval (Minutes)</div>
                <div className="text-[15px] font-bold text-primary-900">
                  {formData.syncInterval ? `${formData.syncInterval} Minutes` : 'Not Set'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
