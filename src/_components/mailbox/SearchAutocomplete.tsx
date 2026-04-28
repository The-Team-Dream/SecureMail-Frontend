"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "../shared/Input";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "../shared/Text";
import { useRouter, usePathname } from "next/navigation";
import { Icons } from "@/constants/icons";

interface SearchAutocompleteProps {
  inputClassName?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  inputClassName,
}) => {
  const searchQuery = useMailStore((s) => s.searchQuery);
  const setSearchQuery = useMailStore((s) => s.setSearchQuery);
  const getFilteredEmails = useMailStore((s) => s.getFilteredEmails);
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    setSearchQuery(""); // clear the search
    const segments = pathname.split("/").filter(Boolean);
    // ensure we build a base path to the mailbox folder/id
    const basePath = `/${segments[0]}/${segments[1]}/${segments[2]}`;
    router.push(`${basePath}/${emailId}`);
  };

  const suggestions = getFilteredEmails().slice(0, 5);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Input
        className={inputClassName}
        type="search"
        leftIcon={<Icons.Mail className="w-5 h-5 text-primary-500" />}
        placeholder="Search Email..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (searchQuery.trim().length > 0) {
            setIsOpen(true);
          }
        }}
      />

      {isOpen && searchQuery.trim().length > 0 && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-primary-100 rounded-xl shadow-lg z-50 overflow-hidden">
          <ul className="flex flex-col">
            {suggestions.map((email) => (
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
                  className="truncate text-primary-900"
                >
                  {email.subject}
                </Text>
                <Text size="xs" color="primary-500" className="truncate">
                  {email.sender}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
