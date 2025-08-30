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
import { updateReservationClose } from "@/lib/store-utils";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";

export default function EditReservationClose({
  reservationClose,
  schoolId,
  buttonProps,
  label,
}: {
  reservationClose: Date;
  schoolId: number;
  buttonProps?: React.ComponentProps<typeof Button>;
  label?: React.ReactNode;
}) {
  const [date, setDate] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState<Date | undefined>();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  useEffect(() => {
    setDate(new Date(reservationClose));
    setTime(new Date(reservationClose));
  }, [reservationClose]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isOpen) {
          setIsProcessing(false);
          setDate(new Date(reservationClose));
          setTime(new Date(reservationClose));
        }
        setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          {...buttonProps}
          className={`w-full ${buttonProps?.className ?? ""}`}
        >
          {label ?? "Uzávierka rezervácie"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upraviť dátum</DialogTitle>
          <DialogDescription>Upraviť dátum uzávierky</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Calendar
            mode="single"
            selected={date}
            className="rounded-md border w-fit"
            onSelect={setDate}
            autoFocus
            disabled={(date) =>
              date < new Date(new Date().setDate(new Date().getDate() - 1))
            }
          />
          <TimePickerHourMinute
            setDate={setTime}
            date={time}
          />

          {error && <p className="text-red-500 py-2">{error}</p>}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setDate(reservationClose);
              setIsOpen(false);
            }}
          >
            Zrušiť
          </Button>
          <Button
            style={{ marginLeft: 0 }}
            disabled={isProcessing}
            onClick={async () => {
              if (date == null) {
                setError("Dátum je povinný");
                setIsProcessing(false);
                return;
              } else if (time == null) {
                setError("Čas je povinný");
                setIsProcessing(false);
                return;
              }
              setError(undefined);

              setIsProcessing(true);

              const year = date.getFullYear();
              const month = date.getMonth();
              const day = date.getDate();
              const hour = time?.getHours();
              const minute = time?.getMinutes();

              await updateReservationClose(schoolId, new Date(year, month, day, hour, minute).toISOString());
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
