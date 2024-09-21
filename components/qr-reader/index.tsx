import React, { useEffect, useState } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { DecodeContinuouslyCallback } from "@zxing/browser/esm/common/DecodeContinuouslyCallback";

const videoId = "qr-video";

export default function QrScanner({
  onResult,
}: {
  onResult: DecodeContinuouslyCallback;
}) {
  const [controls, setControls] = useState<IScannerControls | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");

    const previewElemet = document.getElementById(videoId);
    if (!previewElemet) {
      setError("QR scanner is not supported in this browser.");
      return;
    }

    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: 100,
    });

    codeReader
      .decodeFromConstraints(
        {
          video: {
            facingMode: "environment",
          },
        },
        videoId,
        onResult,
      )
      .then((v) => setControls(v))
      .catch((error: any) => {
        setError(error.message || "An error occurred.");
      });

    return () => {
      controls?.stop();
    };
  }, []);

  return (
    <>
      <video id={videoId} className="w-full h-full" />
      {!!error && <p className="text-red-500 pt-1">{error}</p>}
    </>
  );
}
