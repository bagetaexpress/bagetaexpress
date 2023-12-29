"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QrCode({ pin, ...rest }: any) {
  return <QRCodeSVG {...rest} value={pin} height="" width="" />;
}
