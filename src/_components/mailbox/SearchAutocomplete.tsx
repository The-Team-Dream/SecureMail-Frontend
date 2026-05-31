"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/_components/shared/Input";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "@/_components/shared/Text";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Icons } from "@/constants/icons";
import { useSearchEmails } from "@/APIs/hooks/emails";
import { X } from "lucide-react";

interface SearchAutocompleteProps {
  inputClassName?: string;
}

/**
 * Custom hook that debounces a value by the given delay.
 * Prevents firing API calls on every keystroke.
 */
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  inputClassName,
}) => {
  const [inputValue, setInputValue] = useState("");
  const setSearchQuery = useMailStore((s) => s.setSearchQuery);
  
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const mailboxId = params.mailboxId as string;

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce the search query by 300ms to avoid firing on every keystroke
  const debouncedQuery = useDebouncedValue(inputValue, 300);

  const { data } = useSearchEmails(mailboxId, debouncedQuery, 1);
  const suggestions = (data?.data || []).slice(0, 5);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectSuggestion = (emailId: string) => {
    setIsOpen(false);
    setInputValue("");
    setSearchQuery(""); // Clear global search just in case
    const segments = pathname.split("/").filter(Boolean);
    // ensure we build a base path to the mailbox folder/id
    const basePath = `/${segments[0]}/${segments[1]}/${segments[2]}`;
    router.push(`${basePath}/${emailId}`);
  };

  return (
    <form className="relative w-full" ref={wrapperRef as any} onSubmit={(e) => {
      e.preventDefault();
      // If user presses enter, we could optionally trigger a global search, 
      // but the user asked NOT to update the maillist.
    }}>
      <Input
        className={inputClassName}
        type="search"
        leftIcon={<Icons.Mail className="w-5 h-5 text-primary-500" />}
        placeholder="Search Email..."
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (inputValue.trim().length > 0) {
            setIsOpen(true);
          }
        }}
      />
      
      {/* Custom Clear Button */}
      <AnimatePresence>
        {inputValue.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => {
              setInputValue("");
              setSearchQuery("");
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-primary-100 hover:bg-primary-200 text-primary-600 hover:text-primary-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {isOpen && inputValue.trim().length > 0 && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-primary-100 rounded-xl shadow-lg z-50 overflow-hidden">
          <ul className="flex flex-col">
            {suggestions.map((email: any) => (
              <li
                key={email.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectSuggestion(email.id);
                }}
                className="px-4 py-3 hover:bg-primary-50 cursor-pointer border-b border-primary-50 last:border-0 transition-colors"
              >
                <Text
                  size="sm"
                  font="medium"
                  className="truncate"
                >
                  {email.subject}
                </Text>
                <Text size="xs" color="muted" className="truncate">
                  {email.fromName || email.fromAddr || "Unknown"}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};
