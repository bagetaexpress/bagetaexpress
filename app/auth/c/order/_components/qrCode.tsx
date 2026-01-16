"use client";

import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrCodeProps {
  pin: string;
  className?: string;
}

export default function QrCode({ pin, className }: QrCodeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Regular QR Code with fullscreen button */}
      <div className="relative group">
        <QRCodeSVG
          value={pin}
          className={cn("w-full h-full cursor-pointer", className)}
          level="M"
          onClick={() => setIsFullscreen(true)}
        />
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Zobraziť na celú obrazovku"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 z-10"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-5 h-5 text-gray-600" />
          </Button>

          {/* QR Code - fills available space */}
          <div className="flex-1 w-full flex items-center justify-center min-h-0">
            <QRCodeSVG
              value={pin}
              className="w-full h-full max-w-[min(90vw,90vh-120px)] max-h-[min(90vw,90vh-120px)]"
              level="M"
            />
          </div>

          {/* Order number */}
          <div className="flex-shrink-0 pt-4 pb-2 text-center">
            <p className="text-3xl sm:text-4xl font-bold tracking-wider text-black">
              {pin}
            </p>
            <p className="text-gray-400 mt-2 text-sm">
              Klikni kdekoľvek pre zatvorenie
            </p>
          </div>
        </div>
      )}
    </>
  );
}
