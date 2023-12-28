"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QrCode({ pin }: { pin: string }) {
  return <QRCodeSVG className="flex-1 min-w-max" value={pin} />;
}
