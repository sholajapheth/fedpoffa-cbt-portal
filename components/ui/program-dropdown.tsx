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
import { usePrograms } from "@/lib/api/programs";
import type { Program } from "@/lib/api/programs/types";

interface ProgramDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  department_id?: string;
  activeOnly?: boolean;
}

export function ProgramDropdown({
  value,
  onValueChange,
  placeholder = "Select program...",
  disabled = false,
  className,
  department_id,
  activeOnly = false,
}: ProgramDropdownProps) {
  const [open, setOpen] = useState(false);

  // Get programs
  const { data: programsData, isLoading } = usePrograms({
    department_id,
    is_active: activeOnly ? true : undefined,
  });

  const programs = programsData?.programs || [];

  // Find selected program
  const selectedProgram = programs.find((program) => program.id === value);

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
          {isLoading
            ? "Loading programs..."
            : selectedProgram
            ? selectedProgram.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search programs..." />
          <CommandList>
            <CommandEmpty>No program found.</CommandEmpty>
            <CommandGroup>
              {programs.map((program) => (
                <CommandItem
                  key={program.id}
                  value={program.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === program.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{program.name}</span>
                    <span className="text-sm text-gray-500">
                      {program.code} • {program.level} •{" "}
                      {program.total_enrolled_students} students
                    </span>
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
