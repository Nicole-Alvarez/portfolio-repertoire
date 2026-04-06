"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

type Palette = {
  name: string;
  bg: string;
  card: string;
  accent: string;
  text: string;
};

const palettes: Palette[] = [
  {
    name: "Neon Sapphire",
    bg: "radial-gradient(circle at 18% 22%, #1f4d99 0%, #06112a 28%, #02050d 64%, #010205 100%)",
    card: "#0a1f4e8f",
    accent: "#4ea6ff",
    text: "#eef5ff",
  },
  {
    name: "Cyan Pulse",
    bg: "radial-gradient(circle at 82% 18%, #19a4c2 0%, #083149 26%, #031220 62%, #01060c 100%)",
    card: "#0a3a5a8f",
    accent: "#37d5ff",
    text: "#f2f8ff",
  },
  {
    name: "Violet Current",
    bg: "radial-gradient(circle at 50% 12%, #4b39b3 0%, #1a1a48 30%, #070a1f 62%, #010207 100%)",
    card: "#2b2e6d8f",
    accent: "#9db1ff",
    text: "#f5f9ff",
  },
];

const gestureHelp = [
  "Thumb_Up: increase orb size",
  "Thumb_Down: decrease orb size",
  "Pointing_Up: move orb upward",
  "ILoveYou: move orb right",
  "Victory: switch color theme",
  "Open_Palm: reset orb position",
  "Closed_Fist: toggle pause/resume controls",
];

export default function NeekFolioOnePage() {
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Camera idle");
  const [gestureName, setGestureName] = useState("No gesture");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [orbScale, setOrbScale] = useState(1);
  const [orbX, setOrbX] = useState(0);
  const [orbY, setOrbY] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const processingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const lastActionMsRef = useRef(0);
  const lastGestureRef = useRef("");
  const consoleInfoRef = useRef<typeof console.info | null>(null);
  const consoleWarnRef = useRef<typeof console.warn | null>(null);
  const consoleErrorRef = useRef<typeof console.error | null>(null);

  const palette = palettes[paletteIndex];

  useEffect(() => {
    if (!consoleInfoRef.current) consoleInfoRef.current = console.info;
    if (!consoleWarnRef.current) consoleWarnRef.current = console.warn;
    if (!consoleErrorRef.current) consoleErrorRef.current = console.error;

    const shouldSuppress = (value: unknown) => {
      if (typeof value !== "string") return false;
      return (
        value.includes("Created TensorFlow Lite XNNPACK delegate for CPU") ||
        value.includes("Hand Gesture Recognizer contains CPU only ops") ||
        value.includes("OpenGL error checking is disabled")
      );
    };

    console.info = (...args: unknown[]) => {
      if (shouldSuppress(args[0])) return;
      consoleInfoRef.current?.(...args);
    };
    console.warn = (...args: unknown[]) => {
      if (shouldSuppress(args[0])) return;
      consoleWarnRef.current?.(...args);
    };
    console.error = (...args: unknown[]) => {
      if (shouldSuppress(args[0])) return;
      consoleErrorRef.current?.(...args);
    };

    return () => {
      if (consoleInfoRef.current) console.info = consoleInfoRef.current;
      if (consoleWarnRef.current) console.warn = consoleWarnRef.current;
      if (consoleErrorRef.current) console.error = consoleErrorRef.current;
    };
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    stopLoop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
    setStatusText("Camera stopped");
  }, [stopLoop]);

  useEffect(() => {
    return () => {
      stopCamera();
      recognizerRef.current?.close();
      recognizerRef.current = null;
    };
  }, [stopCamera]);

  const initRecognizer = useCallback(async () => {
    if (recognizerRef.current) return recognizerRef.current;

    setIsLoadingModel(true);
    setError(null);
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
      );

      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
      });

      recognizerRef.current = recognizer;
      setStatusText("Model ready");
      return recognizer;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load MediaPipe model";
      setError(message);
      setStatusText("Model failed to load");
      throw err;
    } finally {
      setIsLoadingModel(false);
    }
  }, []);

  const applyGestureControl = useCallback((gesture: string) => {
    if (paused && gesture !== "Closed_Fist") return;

    switch (gesture) {
      case "Thumb_Up":
        setOrbScale((prev) => Math.min(prev + 0.1, 1.8));
        break;
      case "Thumb_Down":
        setOrbScale((prev) => Math.max(prev - 0.1, 0.6));
        break;
      case "Pointing_Up":
        setOrbY((prev) => Math.max(prev - 16, -120));
        break;
      case "ILoveYou":
        setOrbX((prev) => Math.min(prev + 16, 140));
        break;
      case "Victory":
        setPaletteIndex((prev) => (prev + 1) % palettes.length);
        break;
      case "Open_Palm":
        setOrbX(0);
        setOrbY(0);
        setOrbScale(1);
        break;
      case "Closed_Fist":
        setPaused((prev) => !prev);
        break;
      default:
        break;
    }
  }, [paused]);

  const renderOutlineFrame = useCallback((video: HTMLVideoElement) => {
    const displayCanvas = displayCanvasRef.current;
    const processingCanvas = processingCanvasRef.current;
    if (!displayCanvas || !processingCanvas || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    const displayCtx = displayCanvas.getContext("2d");
    const processingCtx = processingCanvas.getContext("2d", { willReadFrequently: true });
    if (!displayCtx || !processingCtx) return;

    if (
      displayCanvas.width !== video.videoWidth ||
      displayCanvas.height !== video.videoHeight
    ) {
      displayCanvas.width = video.videoWidth;
      displayCanvas.height = video.videoHeight;
    }

    const targetWidth = 320;
    const targetHeight = Math.max(180, Math.floor((targetWidth * video.videoHeight) / video.videoWidth));
    if (
      processingCanvas.width !== targetWidth ||
      processingCanvas.height !== targetHeight
    ) {
      processingCanvas.width = targetWidth;
      processingCanvas.height = targetHeight;
    }

    processingCtx.drawImage(video, 0, 0, processingCanvas.width, processingCanvas.height);
    const frame = processingCtx.getImageData(0, 0, processingCanvas.width, processingCanvas.height);
    const data = frame.data;
    const w = processingCanvas.width;
    const h = processingCanvas.height;
    const gray = new Uint8Array(w * h);

    for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
      gray[p] = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) | 0;
    }

    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const idx = y * w + x;
        const edge = Math.abs(
          4 * gray[idx] - gray[idx - 1] - gray[idx + 1] - gray[idx - w] - gray[idx + w],
        );
        const v = edge > 44 ? 255 : 0;
        const o = idx * 4;
        data[o] = v;
        data[o + 1] = v;
        data[o + 2] = v;
        data[o + 3] = 255;
      }
    }

    processingCtx.putImageData(frame, 0, 0);
    displayCtx.imageSmoothingEnabled = false;
    displayCtx.drawImage(processingCanvas, 0, 0, displayCanvas.width, displayCanvas.height);
  }, []);

  const runRecognitionLoop = useCallback((recognizer: GestureRecognizer) => {
    const detect = () => {
      const video = videoRef.current;
      if (!video || !streamRef.current) return;

      if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const result = recognizer.recognizeForVideo(video, performance.now());
        const top = result.gestures[0]?.[0];
        const gesture = top?.categoryName ?? "No gesture";
        setGestureName(gesture);

        if (gesture !== "No gesture") {
          const now = performance.now();
          const canTrigger =
            gesture !== lastGestureRef.current || now - lastActionMsRef.current > 700;

          if (canTrigger) {
            applyGestureControl(gesture);
            lastActionMsRef.current = now;
            lastGestureRef.current = gesture;
          }
        }
      }

      renderOutlineFrame(video);

      rafRef.current = requestAnimationFrame(detect);
    };

    stopLoop();
    rafRef.current = requestAnimationFrame(detect);
  }, [applyGestureControl, renderOutlineFrame, stopLoop]);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const recognizer = await initRecognizer();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      await video.play();

      setCameraOn(true);
      setStatusText("Live recognition running");
      runRecognitionLoop(recognizer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start camera";
      setError(message);
      setStatusText("Camera failed");
      stopCamera();
    }
  }, [initRecognizer, runRecognitionLoop, stopCamera]);

  return (
    <div className="min-h-screen px-6 py-10 text-white" style={{ background: palette.bg }}>
      <main className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section
          className="rounded-3xl border p-5 shadow-[0_28px_70px_-42px_rgba(0,0,0,0.95)] sm:p-7"
          style={{ borderColor: `${palette.accent}55`, background: palette.card }}
        >
          <p className="text-xs uppercase tracking-[0.22em]" style={{ color: `${palette.accent}` }}>
            neek / folio-1
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl" style={{ color: palette.text }}>
            MediaPipe Gesture Control
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            This page now focuses only on hand gesture recognition with live camera input.
            Show your hand to the camera and control the demo orb in real time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startCamera}
              disabled={isLoadingModel || cameraOn}
              className="rounded-full border px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ borderColor: `${palette.accent}cc`, color: palette.text, backgroundColor: "#ffffff10" }}
            >
              {isLoadingModel ? "Loading model..." : cameraOn ? "Camera running" : "Start camera"}
            </button>
            <button
              type="button"
              onClick={stopCamera}
              disabled={!cameraOn}
              className="rounded-full border px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ borderColor: `${palette.accent}77`, color: palette.text, backgroundColor: "#ffffff08" }}
            >
              Stop camera
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border" style={{ borderColor: `${palette.accent}55` }}>
            <canvas
              ref={displayCanvasRef}
              className="aspect-video w-full -scale-x-100 bg-black object-cover"
            />
            <video
              ref={videoRef}
              className="hidden"
              playsInline
              muted
              autoPlay
            />
            <canvas ref={processingCanvasRef} className="hidden" />
          </div>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl border p-3" style={{ borderColor: `${palette.accent}55` }}>
              <p className="text-white/60">Status</p>
              <p className="mt-1 font-medium" style={{ color: palette.text }}>{statusText}</p>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: `${palette.accent}55` }}>
              <p className="text-white/60">Detected gesture</p>
              <p className="mt-1 font-medium" style={{ color: palette.text }}>{gestureName}</p>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: `${palette.accent}55` }}>
              <p className="text-white/60">Mode</p>
              <p className="mt-1 font-medium" style={{ color: palette.text }}>{paused ? "Paused" : "Active"}</p>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-300/30 bg-red-950/30 p-3 text-sm text-red-100">
              {error}
            </p>
          )}
        </section>

        <section
          className="rounded-3xl border p-5 sm:p-7"
          style={{ borderColor: `${palette.accent}55`, background: "#06060677" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: palette.text }}>Gesture-controlled demo</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.18em]" style={{ color: `${palette.accent}` }}>
            Theme: {palette.name}
          </p>
          <p className="mt-2 text-sm text-white/70">
            The orb below responds to your gestures. Use this as a base for gesture-driven UI controls.
          </p>

          <div className="relative mt-5 h-64 overflow-hidden rounded-2xl border bg-black/30" style={{ borderColor: `${palette.accent}55` }}>
            <div
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-200"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${palette.accent}, #ffffff20 72%)`,
                transform: `translate(calc(-50% + ${orbX}px), calc(-50% + ${orbY}px)) scale(${orbScale})`,
                boxShadow: `0 0 40px ${palette.accent}88`,
              }}
            />
          </div>

          <ul className="mt-5 space-y-2 text-sm text-white/80">
            {gestureHelp.map((item) => (
              <li key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
