import React, { useState } from "react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import {
  Mail, Settings, Lock, Rocket, FileText,
  ArrowRight, ArrowLeft, Eye, EyeOff, Check, ChevronRight,
  ChevronDown, Pencil, X
} from "lucide-react";

interface AddAccountWizardProps {
  onCancel: () => void;
}

export function AddAccountWizard({ onCancel }: AddAccountWizardProps) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState("Gmail");
  const [showPassword, setShowPassword] = useState(false);

  const [editMailbox, setEditMailbox] = useState(false);
  const [editImap, setEditImap] = useState(false);
  const [editSmtp, setEditSmtp] = useState(false);
  const [editAdvanced, setEditAdvanced] = useState(false);

  const [showSyncDropdown, setShowSyncDropdown] = useState(false);
  const [showSummarySyncDropdown, setShowSummarySyncDropdown] = useState(false);

  const [formData, setFormData] = useState({
    mailboxName: "",
    emailAddress: "",
    imapHost: "", imapPort: "", imapSecurity: "SSL/TLS", imapUsername: "", imapPassword: "",
    smtpHost: "", smtpPort: "", smtpSecurity: "SSL/TLS", smtpUsername: "", smtpPassword: "",
    syncInterval: "5"
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { id: 1, icon: Mail },
    { id: 2, icon: Settings },
    { id: 3, icon: Lock },
    { id: 4, icon: Rocket },
    { id: 5, icon: FileText },
  ];

  const handleNext = () => {
    if (step === 1 && provider === "Gmail") {
      alert("Redirecting to Google OAuth...");
      return;
    }
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  if (step === 6) {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-card items-center justify-center p-8">
        <div className="flex flex-col items-center max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mb-8 mt-12">
            <div className="absolute -top-4 -left-8 w-2 h-2 rounded-full bg-blue-500" />
            <div className="absolute top-0 -right-6 w-3 h-3 rounded-sm bg-yellow-400 rotate-12" />
            <div className="absolute bottom-2 -left-6 w-3 h-1 bg-red-400 -rotate-45" />
            <div className="absolute -bottom-4 right-0 w-2 h-2 rounded-full bg-blue-400" />
            <div className="absolute top-10 -right-10 w-2 h-2 rounded-full bg-green-400" />
            <div className="w-24 h-24 bg-secondary-600 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-12 h-12 text-white stroke-[3px]" />
            </div>
          </div>
          <Text as="h2" size="2xl" font="medium" className="text-center mb-2 text-primary-900">Account added successfully</Text>
          <Text size="sm" className="text-primary-400 text-center mb-8 max-w-sm leading-relaxed px-4">
            your account added successfully to SecureMail. Start getting mails securely.
          </Text>
          <Button
            className="w-full max-w-[320px] h-12 bg-primary-900 text-primary-50 hover:bg-primary-800 rounded-xl mb-6"
            onClick={() => { setStep(1); setFormData({ ...formData, mailboxName: "", emailAddress: "" }); }}
          >
            Add New Account
          </Button>
          <button
            onClick={onCancel}
            className="text-sm font-medium text-primary-900 hover:text-primary-600 transition-colors inline-flex items-center gap-1 underline"
          >
            View My accounts <ChevronRight className="w-4 h-4 text-black-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-card relative">
      <div className="flex items-center gap-2.5 px-10 py-5 w-full bg-primary-50 border-b border-primary-100/80 z-10">
        <button onClick={onCancel} className="hover:underline">
          <Text font="semiBold" size="sm" className="text-primary-900">My Accounts</Text>
        </button>
        <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px]" />
        <Text className="text-primary-400 font-medium tracking-wide" size="sm">Add Account</Text>
      </div>

      <div className="flex flex-col flex-1 w-full mx-auto px-8 max-w-5xl pt-6">
        <div className="flex items-center justify-between w-full max-w-[620px] mx-auto mb-16 px-2">
          {steps.map((s, index) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;

            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center flex-shrink-0">
                  {isActive ? (
                    <div className="w-[42px] h-[42px] rounded-full border-[1.5px] border-dashed border-secondary-800 flex items-center justify-center bg-card p-[3px]">
                      <div className="w-full h-full rounded-full flex items-center justify-center bg-secondary-100">
                        <s.icon className="w-5 h-5 stroke-[1.5] text-secondary-800" />
                      </div>
                    </div>
                  ) : isCompleted ? (
                    <div className="w-9 h-9 rounded-full bg-secondary-600 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[2.5] text-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center">
                      <s.icon className="w-4 h-4 stroke-[1.5] text-primary-400" />
                    </div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-[1px] flex-1 mx-3 transition-colors duration-300 ${s.id < step ? 'bg-secondary-600' : 'bg-primary-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>


        <div className={`flex flex-col mb-16 w-full mx-auto flex-1 mt-14 ${step === 5 ? 'max-w-[900px]' : 'max-w-[498px]'}`}>
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center">
              <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">Mailbox Name</Text>
              <Text size="sm" font="normal" className="text-primary-400 text-center mb-14 tracking-wide">Please add the below data to complete adding your account</Text>

              <div className="w-full flex flex-col gap-8 text-left">
                <div className="w-full">
                  <Input
                    label="Mailbox Name"
                    required
                    placeholder="Work Email"
                    value={formData.mailboxName}
                    onChange={(e: any) => handleChange("mailboxName", e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm text-primary-400 mb-1">
                    Provider Type <span className="text-error-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center justify-start gap-10 mt-3 border border-transparent">
                    {[
                      { id: 'Gmail', label: 'Gmail' },
                      { id: 'Outlook', label: 'Outlook' },
                      { id: 'Custom IMAP', label: 'Custom IMAP' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className="flex items-center gap-2.5 cursor-pointer group bg-transparent border-0 p-0 outline-none"
                        onClick={() => setProvider(opt.id)}
                      >
                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all bg-card border-[1.5px] ${provider === opt.id ? 'border-primary-900' : 'border-primary-300 group-hover:border-primary-400'}`}>
                          {provider === opt.id && <div className="w-2 h-2 rounded-full bg-primary-900" />}
                        </div>
                        <Text size="sm" className={`pt-[1px] font-medium tracking-wide ${provider === opt.id ? 'text-primary-900' : 'text-primary-400'}`}>
                          {opt.label}
                        </Text>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center text-left">
              <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">IMAP Config</Text>
              <Text size="sm" font="normal" className="text-primary-400 text-center mb-14 tracking-wide">Please add the below data to complete adding your account</Text>

              <div className="flex flex-col gap-5 w-full">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="w-full">
                    <Input
                      label="IMAP Host"
                      required
                      placeholder="Imap.Company.Com"
                      value={formData.imapHost}
                      onChange={(e: any) => handleChange("imapHost", e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      label="Port"
                      required
                      placeholder="995"
                      value={formData.imapPort}
                      onChange={(e: any) => handleChange("imapPort", e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm text-primary-400 mb-1">
                    Security <span className="text-error-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-primary-100 rounded-xl outline-none appearance-none focus:border-primary-400 text-primary bg-card transition duration-500"
                      value={formData.imapSecurity}
                      onChange={(e: any) => handleChange("imapSecurity", e.target.value)}
                    >
                      <option>SSL/TLS</option>
                      <option>STARTTLS</option>
                      <option>None</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
                  </div>
                </div>

                <div className="w-full">
                  <Input
                    label="Username"
                    placeholder="Enter Your Username"
                    value={formData.imapUsername}
                    onChange={(e: any) => handleChange("imapUsername", e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Enter Password"
                    value={formData.imapPassword}
                    onChange={(e: any) => handleChange("imapPassword", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center text-left">
              <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">SMTP Config</Text>
              <Text size="sm" font="normal" className="text-primary-400 text-center mb-14 tracking-wide">Please add the below data to complete adding your account</Text>

              <div className="flex flex-col gap-5 w-full">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="w-full">
                    <Input
                      label="SMTP Host"
                      required
                      placeholder="Smtp.Company.Com"
                      value={formData.smtpHost}
                      onChange={(e: any) => handleChange("smtpHost", e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      label="Port"
                      required
                      placeholder="465"
                      value={formData.smtpPort}
                      onChange={(e: any) => handleChange("smtpPort", e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm text-primary-400 mb-1">
                    Security <span className="text-error-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-primary-100 rounded-xl outline-none appearance-none focus:border-primary-400 text-primary bg-card transition duration-500"
                      value={formData.smtpSecurity}
                      onChange={(e: any) => handleChange("smtpSecurity", e.target.value)}
                    >
                      <option>SSL/TLS</option>
                      <option>STARTTLS</option>
                      <option>None</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
                  </div>
                </div>

                <div className="w-full">
                  <Input
                    label="Username"
                    placeholder="Enter Your Username"
                    value={formData.smtpUsername}
                    onChange={(e: any) => handleChange("smtpUsername", e.target.value)}
                  />
                </div>

                <div className="w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    label="App Password"
                    placeholder="Enter Password"
                    value={formData.smtpPassword}
                    onChange={(e: any) => handleChange("smtpPassword", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center text-left">
              <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">Advanced Settings</Text>
              <Text size="sm" font="normal" className="text-primary-400 text-center mb-14 tracking-wide">Please add the below data to complete adding your account</Text>

              <div className="flex flex-col gap-6 w-full max-w-[460px] mx-auto">
                <div className="w-full">
                  <label className="block text-[14px] text-primary-500 mb-2">
                    Sync Interval (Minutes)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSyncDropdown(!showSyncDropdown)}
                      className="w-full h-[52px] flex items-center justify-between px-5 border border-primary-200 rounded-[16px] outline-none text-primary bg-card hover:border-primary-300 transition-colors"
                    >
                      <span className="text-[14px] font-medium text-primary-700">
                        {formData.syncInterval === "5" ? "Every 5 Minutes" : `${formData.syncInterval} Minutes`}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform duration-200 ${showSyncDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showSyncDropdown && (
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-primary-50 rounded-[16px] z-50 flex flex-col p-2 gap-1 animate-in fade-in zoom-in-95 duration-150">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { handleChange("syncInterval", i.toString()); setShowSyncDropdown(false); }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-left rounded-[12px] transition-colors hover:bg-primary-200/60 ${formData.syncInterval === i.toString() ? 'bg-primary-200/40 text-primary-900' : 'text-primary-500'}`}
                          >
                            <span className="text-[14px] font-medium">
                              {i === 5 ? "5 Minutes" : `${i} Minutes`}
                            </span>
                            <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px]" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center text-left">
              <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">Summary</Text>
              <Text size="sm" font="normal" className="text-primary-400 text-center mb-14 tracking-wide">Please review your data before confirming</Text>

              <div className="w-full max-w-[900px] flex flex-col mx-auto bg-card mb-8">

                {/* Mailbox Name Block */}
                <div className="flex flex-col py-8 border-b border-primary-100">
                  <div className="flex justify-between items-center w-full mb-6">
                    <div className="flex items-center gap-2.5 text-secondary-600 font-bold text-[16px]">
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
                    <div className="flex items-center gap-2.5 text-secondary-600 font-bold text-[16px]">
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
                        <div><Input type="text" label="Password" value="••••••" readOnly onChange={(e: any) => handleChange("imapPassword", e.target.value)} /></div>
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
                            <div className="text-[24px] leading-none tracking-widest text-primary-900 pt-2">••••••</div>
                            <Eye className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SMTP Config Block */}
                <div className="flex flex-col py-8 border-b border-primary-100">
                  <div className="flex justify-between items-center w-full mb-6">
                    <div className="flex items-center gap-2.5 text-secondary-600 font-bold text-[16px]">
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
                        <div><Input type="text" label="App Password" value="••••••" readOnly onChange={(e: any) => handleChange("smtpPassword", e.target.value)} /></div>
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
                            <div className="text-[24px] leading-none tracking-widest text-primary-900 pt-2">••••••</div>
                            <Eye className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1" />
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
                      <Rocket className="w-5 h-5 stroke-[2.5] text-secondary-600" /> Advanced Settings
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
                              {formData.syncInterval === "5" ? "Every 5 Minutes" : `${formData.syncInterval} Minutes`}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform duration-200 ${showSummarySyncDropdown ? 'rotate-180' : ''}`} />
                          </button>

                          {showSummarySyncDropdown && (
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-primary-50 rounded-[16px] z-50 flex flex-col p-2 gap-1 animate-in fade-in zoom-in-95 duration-150">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => { handleChange("syncInterval", i.toString()); setShowSummarySyncDropdown(false); }}
                                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left rounded-[12px] transition-colors hover:bg-primary-200/60 ${formData.syncInterval === i.toString() ? 'bg-primary-200/40 text-primary-900' : 'text-primary-500'}`}
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
                        <div className="text-[15px] font-bold text-primary-900">{formData.syncInterval} Minutes</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="flex justify-between items-center w-full py-6 pb-8 border-t border-transparent mt-auto relative z-20">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            className={`w-[124px] px-6 h-[46px] rounded-[12px] bg-transparent border-primary-200 text-primary-700 hover:bg-primary-50 flex items-center justify-center gap-2 font-semibold transition-all shadow-sm ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <Button
            onClick={handleNext}
            className="w-[124px] px-6 h-[46px] bg-primary-900 text-primary-50 hover:bg-primary-800 rounded-[12px] flex items-center justify-center gap-2 font-semibold shadow-md"
          >
            {step === 5 ? 'Save' : 'Next'} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>


    </div>
  );
}