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
type HandPoint = { x: number; y: number; z?: number };

const palettes: Palette[] = [
  {
    name: "Neon Sapphire",
    bg: "radial-gradient(circle at 18% 22%, #1f4d99 0%, #06112a 28%, #02050d 64%, #010205 100%)",
    card: "#0a1f4e8f",
    accent: "#4ea6ff",
    text: "#eef5ff",
  },
];

const HAND_CONNECTIONS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];
const FINGER_TIP_COLLIDER_POINTS = [4, 8, 12, 16, 20];

const BASE_BALL_RADIUS = 48;

export default function NeekFolioTwoPage() {
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("Camera idle");
  const [detectedHands, setDetectedHands] = useState(0);
  const [detectedHandSides, setDetectedHandSides] = useState<string[]>([]);
  const [orbX, setOrbX] = useState(0);
  const [orbY, setOrbY] = useState(0);
  const [orbScale, setOrbScale] = useState(1);
  const [handGrabbed, setHandGrabbed] = useState(false);
  const [handCovering, setHandCovering] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const orbXRef = useRef(0);
  const orbYRef = useRef(0);
  const orbScaleRef = useRef(1);
  const smoothedHandsRef = useRef<HandPoint[][]>([]);
  const draggingHandRef = useRef<number | null>(null);
  const twoHandPinchBaselineRef = useRef<number | null>(null);
  const maxScalePinnedRef = useRef(false);
  const statusRef = useRef("Camera idle");
  const handsCountRef = useRef(0);
  const handSidesRef = useRef<string[]>([]);
  const grabbedRef = useRef(false);

  const consoleInfoRef = useRef<typeof console.info | null>(null);
  const consoleWarnRef = useRef<typeof console.warn | null>(null);
  const consoleErrorRef = useRef<typeof console.error | null>(null);

  const palette = palettes[0];

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

  const setStatus = useCallback((next: string) => {
    if (statusRef.current === next) return;
    statusRef.current = next;
    setStatusText(next);
  }, []);

  const setHandsCount = useCallback((next: number) => {
    if (handsCountRef.current === next) return;
    handsCountRef.current = next;
    setDetectedHands(next);
  }, []);

  const setHandSides = useCallback((next: string[]) => {
    const same =
      handSidesRef.current.length === next.length &&
      handSidesRef.current.every((value, idx) => value === next[idx]);
    if (same) return;
    handSidesRef.current = next;
    setDetectedHandSides(next);
  }, []);

  const setGrabbed = useCallback((next: boolean) => {
    if (grabbedRef.current === next) return;
    grabbedRef.current = next;
    setHandGrabbed(next);
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
    if (videoRef.current) videoRef.current.srcObject = null;
    draggingHandRef.current = null;
    smoothedHandsRef.current = [];
    twoHandPinchBaselineRef.current = null;
    maxScalePinnedRef.current = false;
    orbScaleRef.current = 1;
    setCameraOn(false);
    setGrabbed(false);
    setHandCovering(false);
    setOrbScale(1);
    setHandsCount(0);
    setHandSides([]);
    setStatus("Camera stopped");
  }, [setGrabbed, setHandSides, setHandsCount, setStatus, stopLoop]);

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
        numHands: 2,
      });

      recognizerRef.current = recognizer;
      setStatus("Model ready");
      return recognizer;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load MediaPipe model";
      setError(message);
      setStatus("Model failed to load");
      throw err;
    } finally {
      setIsLoadingModel(false);
    }
  }, [setStatus]);

  const validateGestureRequirements = useCallback(() => {
    if (typeof window === "undefined") return "Browser context is unavailable.";
    if (!window.isSecureContext) {
      return "Camera access requires HTTPS (or localhost). Please open this page in a secure context.";
    }
    if (!("mediaDevices" in navigator) || !navigator.mediaDevices?.getUserMedia) {
      return "This browser does not support camera access (getUserMedia).";
    }
    if (typeof WebAssembly === "undefined") {
      return "WebAssembly is unavailable. MediaPipe hand tracking cannot run.";
    }
    return null;
  }, []);

  const renderHandModelFrame = useCallback(
    (hands: HandPoint[][], handSides: string[]) => {
      const canvas = displayCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.clientWidth || 960;
      const cssHeight = canvas.clientHeight || Math.floor(cssWidth * 0.56);
      const width = Math.floor(cssWidth * dpr);
      const height = Math.floor(cssHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "#02050d");
      bg.addColorStop(1, "#050c1d");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      if (hands.length === 0) {
        ctx.strokeStyle = `${palette.accent}55`;
        ctx.lineWidth = 2 * dpr;
        ctx.setLineDash([8 * dpr, 8 * dpr]);
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.5, Math.min(width, height) * 0.16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = `${palette.accent}cc`;
        ctx.font = `${14 * dpr}px sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("Show one or two hands to interact", width * 0.5, height * 0.5 + 46 * dpr);
        return;
      }

      for (let h = 0; h < hands.length; h += 1) {
        const hand = hands[h];
        const tint = h % 2 === 0 ? `${palette.accent}cc` : "#9db1ffcc";
        const pointTint = h % 2 === 0 ? palette.accent : "#9db1ff";

        ctx.strokeStyle = tint;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2.8 * dpr;

        for (const [a, b] of HAND_CONNECTIONS) {
          const p1 = hand[a];
          const p2 = hand[b];
          if (!p1 || !p2) continue;
          const x1 = (1 - p1.x) * width;
          const y1 = p1.y * height;
          const x2 = (1 - p2.x) * width;
          const y2 = p2.y * height;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        for (let i = 0; i < hand.length; i += 1) {
          const point = hand[i];
          if (!point) continue;
          const x = (1 - point.x) * width;
          const y = point.y * height;
          const tip = i === 4 || i === 8 || i === 12 || i === 16 || i === 20;
          const radius = (tip ? 5 : 3.2) * dpr;
          ctx.fillStyle = tip ? pointTint : `${pointTint}aa`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        const wrist = hand[0];
        if (wrist) {
          const labelX = (1 - wrist.x) * width;
          const labelY = wrist.y * height - 18 * dpr;
          const handSide = handSides[h] ?? "Unknown";
          ctx.fillStyle = "#050b1ecc";
          const boxWidth = 64 * dpr;
          const boxHeight = 20 * dpr;
          ctx.fillRect(labelX - boxWidth / 2, labelY - boxHeight / 2, boxWidth, boxHeight);
          ctx.fillStyle = pointTint;
          ctx.font = `${11 * dpr}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(handSide, labelX, labelY);
        }
      }
    },
    [palette.accent],
  );

  const stabilizeHands = useCallback(
    (hands: HandPoint[][], handSides: string[]) => {
      if (hands.length === 0) {
        smoothedHandsRef.current = [];
        return { hands: [] as HandPoint[][], sides: [] as string[] };
      }

      const indices = hands.map((_, idx) => idx);
      indices.sort((a, b) => {
        const sideA = handSides[a] ?? "Unknown";
        const sideB = handSides[b] ?? "Unknown";
        const rank = (side: string) => (side === "Left" ? 0 : side === "Right" ? 1 : 2);
        const sideRankDiff = rank(sideA) - rank(sideB);
        if (sideRankDiff !== 0) return sideRankDiff;
        const ax = 1 - (hands[a][0]?.x ?? 0.5);
        const bx = 1 - (hands[b][0]?.x ?? 0.5);
        return ax - bx;
      });

      const orderedHands = indices.map((idx) => hands[idx]);
      const orderedSides = indices.map((idx) => handSides[idx] ?? "Unknown");

      const prev = smoothedHandsRef.current;
      const alpha = 0.3;
      const deadzone = 0.0028;

      const next = orderedHands.map((hand, handIdx) =>
        hand.map((point, pointIdx) => {
          const previous = prev[handIdx]?.[pointIdx];
          if (!previous) return { x: point.x, y: point.y };
          const dx = point.x - previous.x;
          const dy = point.y - previous.y;
          if (dx * dx + dy * dy < deadzone * deadzone) return previous;
          return {
            x: previous.x + dx * alpha,
            y: previous.y + dy * alpha,
            z:
              previous.z !== undefined && point.z !== undefined
                ? previous.z + (point.z - previous.z) * alpha
                : point.z,
          };
        }),
      );

      smoothedHandsRef.current = next;
      return { hands: next, sides: orderedSides };
    },
    [],
  );

  const updateOrbFromHands = useCallback(
    (hands: HandPoint[][]) => {
      const canvas = displayCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width <= 0 || height <= 0) return;

      let activeCovering = false;

      const clampX = (value: number) => Math.max(-width * 0.44, Math.min(width * 0.44, value));
      const clampY = (value: number) => Math.max(-height * 0.44, Math.min(height * 0.44, value));
      const distanceToSegment = (
        px: number,
        py: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => {
        const vx = x2 - x1;
        const vy = y2 - y1;
        const len2 = vx * vx + vy * vy;
        if (len2 === 0) return Math.hypot(px - x1, py - y1);
        const t = Math.max(0, Math.min(1, ((px - x1) * vx + (py - y1) * vy) / len2));
        const nx = x1 + vx * t;
        const ny = y1 + vy * t;
        return Math.hypot(px - nx, py - ny);
      };
      const moveOrbSmooth = (targetX: number, targetY: number) => {
        const alpha = 0.74;
        const nextX = orbXRef.current + (targetX - orbXRef.current) * alpha;
        const nextY = orbYRef.current + (targetY - orbYRef.current) * alpha;
        const dx = nextX - orbXRef.current;
        const dy = nextY - orbYRef.current;
        if (Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25) return;
        orbXRef.current = nextX;
        orbYRef.current = nextY;
        setOrbX(nextX);
        setOrbY(nextY);
      };

      type HandContact = {
        handIndex: number;
        strength: number;
        covering: boolean;
        targetX: number;
        targetY: number;
        pinchX: number;
        pinchY: number;
      };
      const contacts: HandContact[] = [];

      for (let i = 0; i < hands.length; i += 1) {
        const hand = hands[i];
        if (!hand.length) continue;
        const thumbTipNorm = hand[4];
        const indexTipNorm = hand[8];
        const middleTipNorm = hand[12];
        const ringTipNorm = hand[16];
        const indexMcpNorm = hand[5];
        const pinkyMcpNorm = hand[17];
        if (!thumbTipNorm || !indexTipNorm || !middleTipNorm || !ringTipNorm || !indexMcpNorm || !pinkyMcpNorm) continue;
        const projected = hand.map((point) => ({
          x: ((1 - point.x) - 0.5) * width,
          y: (point.y - 0.5) * height,
          z: point.z ?? 0,
        }));
        const thumbTip = projected[4];
        const indexTip = projected[8];
        if (!thumbTip || !indexTip) continue;

        const currentRadius = BASE_BALL_RADIUS * (grabbedRef.current ? 1.2 : 1);
        const contactPoints: { x: number; y: number }[] = [];
        let closePoints = 0;

        for (let p = 0; p < FINGER_TIP_COLLIDER_POINTS.length; p += 1) {
          const point = projected[FINGER_TIP_COLLIDER_POINTS[p]];
          if (Math.hypot(point.x - orbXRef.current, point.y - orbYRef.current) <= currentRadius * 1.08) {
            closePoints += 1;
            contactPoints.push(point);
          }
        }
        // Tip-only interaction: ignore finger line segments and palm links.

        const pinchDistanceIndex = Math.hypot(
          thumbTipNorm.x - indexTipNorm.x,
          thumbTipNorm.y - indexTipNorm.y,
          (thumbTipNorm.z ?? 0) - (indexTipNorm.z ?? 0),
        );
        const pinchDistanceMiddle = Math.hypot(
          thumbTipNorm.x - middleTipNorm.x,
          thumbTipNorm.y - middleTipNorm.y,
          (thumbTipNorm.z ?? 0) - (middleTipNorm.z ?? 0),
        );
        const pinchDistanceRing = Math.hypot(
          thumbTipNorm.x - ringTipNorm.x,
          thumbTipNorm.y - ringTipNorm.y,
          (thumbTipNorm.z ?? 0) - (ringTipNorm.z ?? 0),
        );
        const handSpan = Math.max(
          0.04,
          Math.hypot(
            indexMcpNorm.x - pinkyMcpNorm.x,
            indexMcpNorm.y - pinkyMcpNorm.y,
            (indexMcpNorm.z ?? 0) - (pinkyMcpNorm.z ?? 0),
          ),
        );
        const pinchRatio =
          Math.min(
            pinchDistanceIndex,
            pinchDistanceMiddle * 1.04,
            pinchDistanceRing * 1.02,
          ) / handSpan;
        const pinchActive =
          draggingHandRef.current === i
            ? pinchRatio < 0.9
            : pinchRatio < 0.72;
        if (!pinchActive) continue;

        const pinchX = (thumbTip.x + indexTip.x) * 0.5;
        const pinchY = (thumbTip.y + indexTip.y) * 0.5;
        const thumbDistanceToBall = Math.hypot(
          thumbTip.x - orbXRef.current,
          thumbTip.y - orbYRef.current,
        );
        const indexDistanceToBall = Math.hypot(
          indexTip.x - orbXRef.current,
          indexTip.y - orbYRef.current,
        );
        const pinchLineDistanceToBall = distanceToSegment(
          orbXRef.current,
          orbYRef.current,
          thumbTip.x,
          thumbTip.y,
          indexTip.x,
          indexTip.y,
        );
        const pickupRadius =
          currentRadius *
          (draggingHandRef.current === i ? 2.5 : 2.15);
        const pinchNearBall =
          Math.min(
            Math.hypot(pinchX - orbXRef.current, pinchY - orbYRef.current),
            thumbDistanceToBall,
            indexDistanceToBall,
            pinchLineDistanceToBall,
          ) <= pickupRadius;
        const touchingBall = closePoints > 0;
        if (!(touchingBall || pinchNearBall)) continue;

        let sumX = 0;
        let sumY = 0;
        for (let c = 0; c < contactPoints.length; c += 1) {
          sumX += contactPoints[c].x;
          sumY += contactPoints[c].y;
        }
        const count = Math.max(1, contactPoints.length);
        const targetX = clampX(
          contactPoints.length > 0 ? (sumX / count + pinchX) * 0.5 : pinchX,
        );
        const targetY = clampY(
          contactPoints.length > 0 ? (sumY / count + pinchY) * 0.5 : pinchY,
        );
        const coveringBall = closePoints >= 4;
        const strength = closePoints + (pinchNearBall ? 3 : 0);

        contacts.push({
          handIndex: i,
          strength,
          covering: coveringBall,
          targetX,
          targetY,
          pinchX,
          pinchY,
        });
      }

      if (contacts.length >= 2) {
        const pair = contacts
          .slice()
          .sort((a, b) => b.strength - a.strength)
          .slice(0, 2);
        const [a, b] = pair;
        const oppositeSides =
          (a.pinchX - orbXRef.current) * (b.pinchX - orbXRef.current) < 0;
        if (oppositeSides) {
          const pinchDistance = Math.hypot(
            a.pinchX - b.pinchX,
            a.pinchY - b.pinchY,
          );
          if (twoHandPinchBaselineRef.current === null) {
            twoHandPinchBaselineRef.current = Math.max(1, pinchDistance);
          }
          const scaleTarget = Math.max(
            0.7,
            Math.min(6, pinchDistance / twoHandPinchBaselineRef.current),
          );
          if (scaleTarget >= 5.98) {
            maxScalePinnedRef.current = true;
          } else if (scaleTarget < 5.75) {
            maxScalePinnedRef.current = false;
          }
          const nextScale =
            orbScaleRef.current + (scaleTarget - orbScaleRef.current) * 0.62;
          if (Math.abs(nextScale - orbScaleRef.current) > 0.002) {
            orbScaleRef.current = nextScale;
            setOrbScale(nextScale);
          }

          const midX = clampX((a.pinchX + b.pinchX) * 0.5);
          const midY = clampY((a.pinchY + b.pinchY) * 0.5);
          moveOrbSmooth(midX, midY);

          draggingHandRef.current = null;
          setGrabbed(true);
          setHandCovering(a.covering || b.covering);
          setStatus("Interacting (2-hand scale)");
          return;
        }
      }

      let selected: HandContact | null = null;
      if (contacts.length > 0) {
        const activeIdx = draggingHandRef.current;
        selected = contacts
          .slice()
          .sort((a, b) => {
            const aScore = a.strength + (a.handIndex === activeIdx ? 0.35 : 0);
            const bScore = b.strength + (b.handIndex === activeIdx ? 0.35 : 0);
            return bScore - aScore;
          })[0];
      }

      if (selected) {
        twoHandPinchBaselineRef.current = null;
        if (!maxScalePinnedRef.current && Math.abs(orbScaleRef.current - 1) > 0.002) {
          const nextScale = orbScaleRef.current + (1 - orbScaleRef.current) * 0.45;
          orbScaleRef.current = nextScale;
          setOrbScale(nextScale);
        }
        activeCovering = selected.covering;
        moveOrbSmooth(selected.targetX, selected.targetY);

        draggingHandRef.current = selected.handIndex;
        setGrabbed(true);
        setHandCovering(activeCovering);
        setStatus("Interacting");
      } else {
        draggingHandRef.current = null;
        twoHandPinchBaselineRef.current = null;
        if (!maxScalePinnedRef.current && Math.abs(orbScaleRef.current - 1) > 0.002) {
          const nextScale = orbScaleRef.current + (1 - orbScaleRef.current) * 0.35;
          orbScaleRef.current = nextScale;
          setOrbScale(nextScale);
        }
        setGrabbed(false);
        setHandCovering(false);
        setStatus(hands.length > 0 ? "Hand detected" : "No hand detected");
      }
    },
    [setGrabbed, setStatus],
  );

  const runRecognitionLoop = useCallback(
    (recognizer: GestureRecognizer) => {
      const detect = () => {
        const video = videoRef.current;
        if (!video || !streamRef.current) return;

        if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime;
          const result = recognizer.recognizeForVideo(video, performance.now());
          const rawHands = result.landmarks ?? [];
          const rawHandSides = (result.handedness ?? []).map(
            (item) => item?.[0]?.categoryName ?? "Unknown",
          );
          const stabilized = stabilizeHands(rawHands, rawHandSides);
          const hands = stabilized.hands;
          const handSides = stabilized.sides;

          setHandsCount(hands.length);
          setHandSides(handSides);
          renderHandModelFrame(hands, handSides);
          updateOrbFromHands(hands);
        }

        rafRef.current = requestAnimationFrame(detect);
      };

      stopLoop();
      rafRef.current = requestAnimationFrame(detect);
    },
    [renderHandModelFrame, setHandSides, setHandsCount, stabilizeHands, stopLoop, updateOrbFromHands],
  );

  const startCamera = useCallback(async () => {
    setError(null);
    setWarning(null);
    const environmentWarning = validateGestureRequirements();
    if (environmentWarning) {
      setWarning(environmentWarning);
      setStatus("Requirements missing");
      return;
    }

    try {
      const recognizer = await initRecognizer();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      if (!track) {
        setWarning("No video track found. Please select/enable a camera device.");
        setStatus("Camera unavailable");
        stopCamera();
        return;
      }
      if (!track.enabled || track.readyState !== "live") {
        setWarning("Camera track is not active. Turn on camera permission/device and try again.");
        setStatus("Camera unavailable");
        stopCamera();
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;
      await video.play();
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setWarning("Camera started but no video frames are available. Check camera privacy settings.");
      }

      setCameraOn(true);
      setStatus("Live tracking running");
      runRecognitionLoop(recognizer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start camera";
      setError(message);
      setStatus("Camera failed");
      stopCamera();
    }
  }, [initRecognizer, runRecognitionLoop, setStatus, stopCamera, validateGestureRequirements]);

  return (
    <div className="min-h-screen px-4 py-6 text-white sm:px-6 sm:py-8" style={{ background: palette.bg }}>
      <main className="mx-auto w-full max-w-7xl">
        <section className="rounded-3xl border p-4 sm:p-6" style={{ borderColor: `${palette.accent}55`, background: palette.card }}>
          <div className="relative overflow-hidden rounded-2xl border" style={{ borderColor: `${palette.accent}55` }}>
            <canvas ref={displayCanvasRef} className="aspect-video w-full bg-black object-cover" />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${palette.accent}, #ffffff20 72%)`,
                transform: `translate(calc(-50% + ${orbX}px), calc(-50% + ${orbY}px)) scale(${orbScale})`,
                boxShadow: handGrabbed ? `0 0 70px ${palette.accent}dd` : `0 0 38px ${palette.accent}88`,
                opacity: handCovering ? 0.45 : 1,
              }}
            />
            <video ref={videoRef} className="hidden" playsInline muted autoPlay />
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border p-4" style={{ borderColor: `${palette.accent}55`, background: "#06060666" }}>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Status</p>
            <p className="mt-2 text-lg font-medium" style={{ color: palette.text }}>{statusText}</p>
            <p className="mt-2 text-sm text-white/70">Hands detected: {detectedHands}</p>
            <p className="mt-1 text-sm text-white/70">
              Hand side: {detectedHandSides.length > 0 ? detectedHandSides.join(", ") : "None"}
            </p>
          </article>

          <article className="rounded-2xl border p-4" style={{ borderColor: `${palette.accent}55`, background: "#06060666" }}>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Controls</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={startCamera}
                disabled={isLoadingModel || cameraOn}
                className="rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{ borderColor: `${palette.accent}cc`, color: palette.text, backgroundColor: "#ffffff10" }}
              >
                {isLoadingModel ? "Loading model..." : cameraOn ? "Camera running" : "Start camera"}
              </button>
              <button
                type="button"
                onClick={stopCamera}
                disabled={!cameraOn}
                className="rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{ borderColor: `${palette.accent}77`, color: palette.text, backgroundColor: "#ffffff08" }}
              >
                Stop camera
              </button>
            </div>
          </article>

          <article className="rounded-2xl border p-4" style={{ borderColor: `${palette.accent}55`, background: "#06060666" }}>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Interaction</p>
            <ul className="mt-2 space-y-2 text-sm text-white/80">
              <li>1. Touch the ball area with your hand model.</li>
              <li>2. Pinch thumb + index on the ball to grab and move it.</li>
              <li>3. Keep pinch held while dragging to move the ball.</li>
              <li>4. Pinch both sides with 2 hands: apart to enlarge, inward to shrink.</li>
              <li>5. Cover the ball with your hand to hide it partially.</li>
              <li>6. Supports up to 2 hands with live hand models.</li>
            </ul>
          </article>
        </section>

        {error && (
          <p className="mt-4 rounded-xl border border-red-300/30 bg-red-950/30 p-3 text-sm text-red-100">
            {error}
          </p>
        )}
        {warning && (
          <p className="mt-4 rounded-xl border border-amber-300/40 bg-amber-950/30 p-3 text-sm text-amber-100">
            Warning: {warning}
          </p>
        )}
      </main>
    </div>
  );
}
