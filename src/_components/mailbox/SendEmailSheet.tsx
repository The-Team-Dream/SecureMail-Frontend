"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMailStore } from "@/stores/useMailStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/_components/shared/Input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Paperclip,
  Smile,
  Link as LinkIcon,
  Image as ImageIcon,
  Trash2,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

const emailSchema = z.object({
  from: z.string().email("Invalid sender email"),
  to: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  bodyText: z.string().optional(),
  bodyHtml: z.string().optional(),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export const ComposeEmailSheet = () => {
  const isOpen = useMailStore((s) => s.isComposeOpen);
  const setOpen = useMailStore((s) => s.setComposeOpen);

  const connectedAccounts = [
    { id: 1, email: "m.tarek@4horizons.com.sa" },
    { id: 2, email: "personal@gmail.com" },
  ];

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      from: connectedAccounts[0]?.email || "",
      to: "",
      subject: "Test from securemail",
      cc: "",
      bcc: "",
      bodyText: "",
      bodyHtml: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        from: connectedAccounts[0]?.email || "",
        to: "",
        subject: "",
        cc: "",
        bcc: "",
        bodyText: "",
        bodyHtml: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = (data: EmailFormValues) => {
    console.log("Sending email:", data);
    toast.success("Email sent successfully!", {
      position: "bottom-left",
      style: {
        backgroundColor: "#000",
      },
    });
    setOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-2xl p-0 flex flex-col bg-white">
        <SheetHeader className="p-6 border-b border-gray-100 flex flex-row items-center justify-between">
          <SheetTitle className="text-xl font-semibold text-primary-950">
            New Email
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* From */}
            <div className="flex items-center gap-4">
              <label className="w-16 text-sm font-medium text-primary-500">
                From
              </label>
              <div className="flex-1">
                <Controller
                  name="from"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full border-gray-200 rounded-lg">
                        <SelectValue placeholder="Select sender" />
                      </SelectTrigger>
                      <SelectContent>
                        {connectedAccounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.email}>
                            {acc.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.from && (
                  <p className="text-sm text-error-500 mt-1">
                    {form.formState.errors.from.message}
                  </p>
                )}
              </div>
            </div>

            {/* To */}
            <div className="flex items-center gap-4">
              <label className="w-16 text-sm font-medium text-primary-500 flex items-center">
                To <span className="text-error-500 ml-1">*</span>
              </label>
              <div className="flex-1">
                <Input
                  {...form.register("to")}
                  className="w-full border-gray-200"
                  placeholder="Recipient email..."
                  error={form.formState.errors.to?.message}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-center gap-4">
              <label className="w-16 text-sm font-medium text-primary-500">
                Subject
              </label>
              <div className="flex-1">
                <Input
                  {...form.register("subject")}
                  className="w-full border-gray-200"
                  placeholder="Subject..."
                  error={form.formState.errors.subject?.message}
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-2 pt-2 h-full">
              <Controller
                name="bodyText"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Type Here..."
                    className="min-h-[300px] flex-1 resize-none border-gray-200 rounded-lg focus-visible:ring-primary-400 p-4"
                  />
                )}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white rounded-lg px-6 flex items-center gap-2"
              >
                Send
                <Send className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-primary-500 hover:text-primary-900 rounded-full"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-primary-500 hover:text-primary-900 rounded-full"
                >
                  <Smile className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-primary-500 hover:text-primary-900 rounded-full"
                >
                  <LinkIcon className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-primary-500 hover:text-primary-900 rounded-full"
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-primary-500 hover:text-error-500 hover:bg-error-50 rounded-full"
              title="Discard draft"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
