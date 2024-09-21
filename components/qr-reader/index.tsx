import React, { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { DecodeContinuouslyCallback } from "@zxing/browser/esm/common/DecodeContinuouslyCallback";

const videoId = "qr-video";

export default function QrScanner({
  onResult,
}: {
  onResult: DecodeContinuouslyCallback;
}) {
  const [error, setError] = useState("");
  const previewElementRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setError("");
    if (!previewElementRef.current) {
      setError("QR scanner is not supported in this browser.");
      return;
    }

    const codeReader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts: 250,
    });

    let controls: IScannerControls | null = null;
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
      .then((v) => {
        controls = v;
      })
      .catch((error: any) => {
        setError(error.message || "An error occurred.");
      });

    return () => {
      controls?.stop();
    };
  }, [previewElementRef]);

  return (
    <>
      <video id={videoId} ref={previewElementRef} className="w-full h-full" />
      {!!error && <p className="text-red-500 pt-1">{error}</p>}
    </>
  );
}
