"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimePickerHourMinute } from "@/components/ui/custom/time-picker-hour-minute";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateSchoolStoreOrderClose } from "@/db/controllers/schoolController";
import { updateOrderClose } from "@/lib/storeUtils";
import { getUser } from "@/lib/userUtils";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { Calendar as CalendarIcon, Loader } from "lucide-react";
import React, { use } from "react";

interface IProps {
  orderClose: Date;
  schoolId: number;
}

export default function EditOrderClose({ orderClose, schoolId }: IProps) {
  const [date, setDate] = React.useState<Date | undefined>(orderClose);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isOpen) {
          setIsProcessing(false);
          setDate(orderClose);
        }
        setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex-1">Upraviť dátum</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upraviť dátum</DialogTitle>
          <DialogDescription>
            Upraviť dátum uzávierky objednávok
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Calendar
            mode="single"
            selected={date}
            className="rounded-md border w-fit"
            onSelect={(val) => {
              if (val == null) return;
              const time = date == null ? "00:00" : format(date, "HH:mm");
              const newDate = set(val, {
                hours: parseInt(time.split(":")[0]),
                minutes: parseInt(time.split(":")[1]),
              });

              setDate(newDate);
            }}
            initialFocus
            disabled={(date) =>
              date < new Date(new Date().setDate(new Date().getDate() - 1))
            }
          />
          <TimePickerHourMinute setDate={setDate} date={date} />
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setDate(orderClose);
              setIsOpen(false);
            }}
          >
            Zrušiť
          </Button>
          <Button
            style={{ marginLeft: 0 }}
            disabled={isProcessing}
            onClick={async () => {
              if (!date) return;
              setIsProcessing(true);
              await updateOrderClose(schoolId, date);
              setIsProcessing(false);
              setIsOpen(false);
            }}
          >
            {isProcessing && <Loader className="mr-2 animate-spin h-5 w-5" />}
            Uložiť
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
