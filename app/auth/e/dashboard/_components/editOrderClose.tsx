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

  React.useEffect(() => {
    console.log(date);
  }, [date]);

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
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP HH:mm:ss")
              ) : (
                <span>Vybrať dátum a čas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
            <div className="p-3 border-t border-border">
              <TimePickerHourMinute setDate={setDate} date={date} />
            </div>
          </PopoverContent>
          <DialogFooter>
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
        </Popover>
      </DialogContent>
    </Dialog>
  );
}
