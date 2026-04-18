import { useRef, useEffect, useState } from "react";

interface SignaturePadProps {
  onChange: (signature: string | null, type: "drawn" | "typed") => void;
}

export function SignaturePad({ onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onChangeRef = useRef(onChange);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedName, setTypedName] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setupCtx = () => {
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };
    setupCtx();

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      if ("touches" in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }
      return {
        x: ((e as MouseEvent).clientX - rect.left) * scaleX,
        y: ((e as MouseEvent).clientY - rect.top) * scaleY,
      };
    };

    const onStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawing = true;
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastX = pos.x;
      lastY = pos.y;
    };

    const onEnd = () => {
      if (!isDrawing) return;
      isDrawing = false;
      setHasDrawn(true);
      onChangeRef.current(canvas.toDataURL("image/png"), "drawn");
    };

    canvas.addEventListener("mousedown", onStart);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onEnd);
    canvas.addEventListener("mouseleave", onEnd);
    canvas.addEventListener("touchstart", onStart, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onEnd);

    return () => {
      canvas.removeEventListener("mousedown", onStart);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onEnd);
      canvas.removeEventListener("mouseleave", onEnd);
      canvas.removeEventListener("touchstart", onStart);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onEnd);
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChangeRef.current(null, "drawn");
  };

  const handleModeSwitch = (newMode: "draw" | "type") => {
    setMode(newMode);
    if (newMode === "draw") {
      onChangeRef.current(null, "drawn");
    } else {
      onChangeRef.current(typedName || null, "typed");
    }
  };

  const handleTypedChange = (value: string) => {
    setTypedName(value);
    onChangeRef.current(value || null, "typed");
  };

  return (
    <div className="space-y-4">
      <div className="flex rounded-lg overflow-hidden border border-gray-700/50">
        <button
          onClick={() => handleModeSwitch("draw")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors border-r border-gray-700/50 ${
            mode === "draw" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          ✏️ Draw Signature
        </button>
        <button
          onClick={() => handleModeSwitch("type")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mode === "type" ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          ⌨️ Type Name
        </button>
      </div>

      {mode === "draw" ? (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={150}
            className="w-full h-32 rounded-xl border border-gray-600/50 bg-gray-800/30 cursor-crosshair"
            style={{ touchAction: "none" }}
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-600 text-sm select-none">Sign here with mouse or finger</p>
            </div>
          )}
          {hasDrawn && (
            <button
              onClick={clearCanvas}
              className="absolute top-2 right-2 text-xs text-gray-500 hover:text-red-400 transition-colors bg-gray-900/80 px-2.5 py-1 rounded-md border border-gray-700/50"
            >
              Clear
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={typedName}
            onChange={(e) => handleTypedChange(e.target.value)}
            placeholder="Type your full legal name"
            className="w-full px-4 py-3 rounded-xl bg-gray-800/60 border border-gray-600/50 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/70 text-lg italic"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          />
          {typedName && (
            <p className="text-xs text-gray-500 px-1">
              By typing your name, you acknowledge this as your legally binding signature.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
