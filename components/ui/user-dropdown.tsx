"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUsers } from "@/lib/api/users";
import type { User } from "@/lib/api/users/types";

interface UserDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  role?: string;
  department_id?: string;
  is_active?: boolean;
  search?: string;
  limit?: number;
}

export function UserDropdown({
  value,
  onValueChange,
  placeholder = "Select user...",
  disabled = false,
  className,
  role,
  department_id,
  is_active,
  search,
  limit = 100,
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const { data: usersData, isLoading } = useUsers({
    role,
    department_id,
    is_active,
    search,
    limit,
  });
  const users: User[] = usersData?.data || [];
  const selectedUser = users.find((u) => u.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            "Loading users..."
          ) : selectedUser ? (
            <span>
              {selectedUser.full_name}
              <span className="text-xs text-gray-500 ml-2">
                {selectedUser.email}
              </span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.full_name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
