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
import { updateOrderClose } from "@/lib/storeUtils";
import { getFormatedDate } from "@/lib/utils";
import { format } from "date-fns";
import { Loader } from "lucide-react";
import React from "react";

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
              const time = format(date ?? new Date(), "HH:mm");
              const newDate = format(val, "yyyy-MM-dd");

              setDate(new Date(`${newDate} ${time}`));
            }}
            initialFocus
            disabled={(date) =>
              date < new Date(new Date().setDate(new Date().getDate() - 1))
            }
          />
          <TimePickerHourMinute
            setDate={(val) => {
              if (val == null) return;
              const newDate = format(date ?? new Date(), "yyyy-MM-dd");
              const newTime = format(val, "HH:mm");
              setDate(new Date(`${newDate} ${newTime}`));
            }}
            date={date}
          />
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

              const offset = date.getTimezoneOffset() * 60 * 1000;
              const time = date.getTime() + offset;
              const newDate = new Date(time);

              await updateOrderClose(
                schoolId,
                getFormatedDate(newDate),
              );
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
