"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/types";
import type {
  ShowroomMode,
  CameraView,
  ShowroomConfig,
  ConfigSnapshot,
  AIIdentificationResult,
} from "@/lib/showroom-types";
import {
  createDefaultConfig,
  getShowroomData,
} from "@/lib/showroom-data";
import {
  computeShowroomSpecs,
  createSnapshot,
} from "@/lib/showroom-utils";

interface ShowroomContextValue {
  product: Product;
  data: ReturnType<typeof getShowroomData>;
  mode: ShowroomMode;
  setMode: (mode: ShowroomMode) => void;
  cameraView: CameraView;
  setCameraView: (view: CameraView) => void;
  config: ShowroomConfig;
  updateConfig: (patch: Partial<ShowroomConfig>) => void;
  toggleAccessory: (id: string) => void;
  specs: ReturnType<typeof computeShowroomSpecs>;
  selectedHotspot: string | null;
  setSelectedHotspot: (id: string | null) => void;
  selectedPart: string | null;
  setSelectedPart: (id: string | null) => void;
  savedConfigs: ConfigSnapshot[];
  saveCurrentConfig: (label?: string) => Promise<void>;
  saveStatus: "idle" | "saving" | "saved" | "error";
  compareConfig: ConfigSnapshot | null;
  setCompareConfig: (cfg: ConfigSnapshot | null) => void;
  aiResult: AIIdentificationResult | null;
  aiAnalyzing: boolean;
  runAIIdentification: (file: File) => Promise<void>;
  explodedProgress: number;
  setExplodedProgress: (v: number) => void;
  hoveredPart: string | null;
  setHoveredPart: (id: string | null) => void;
}

const ShowroomContext = createContext<ShowroomContextValue | null>(null);

export function ShowroomProvider({
  product,
  children,
}: {
  product: Product;
  children: ReactNode;
}) {
  const data = useMemo(() => getShowroomData(product), [product]);
  const [mode, setMode] = useState<ShowroomMode>("showroom");
  const [cameraView, setCameraView] = useState<CameraView>("exterior");
  const [config, setConfig] = useState<ShowroomConfig>(() =>
    createDefaultConfig(product)
  );
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<ConfigSnapshot[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [compareConfig, setCompareConfig] = useState<ConfigSnapshot | null>(null);
  const [aiResult, setAiResult] = useState<AIIdentificationResult | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [explodedProgress, setExplodedProgress] = useState(0);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const specs = useMemo(
    () => computeShowroomSpecs(product, config),
    [product, config]
  );

  const updateConfig = useCallback((patch: Partial<ShowroomConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleAccessory = useCallback((id: string) => {
    setConfig((prev) => {
      const has = prev.accessories.includes(id);
      return {
        ...prev,
        accessories: has
          ? prev.accessories.filter((a) => a !== id)
          : [...prev.accessories, id],
      };
    });
  }, []);

  const saveCurrentConfig = useCallback(
    async (label = "Gespeichert") => {
      const snap = createSnapshot(product, config, label);
      setSavedConfigs((prev) => [snap, ...prev].slice(0, 5));
      setCompareConfig(snap);
      setSaveStatus("saving");

      const { accessories, ...selections } = config;
      try {
        const res = await fetch("/api/configurations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            selections,
            accessories,
          }),
        });
        if (!res.ok) throw new Error("save failed");
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    },
    [product, config]
  );

  const runAIIdentification = useCallback(
    async (file: File) => {
      setAiAnalyzing(true);
      setAiResult(null);
      setMode("parts");
      await new Promise((r) => setTimeout(r, 2200));
      const partIndex = file.name.length % data.parts.length;
      const part = data.parts[partIndex];
      setAiResult({
        partId: part.id,
        partName: part.name,
        confidence: 87 + (file.size % 12),
        suggestedParts: [part.id, data.parts[(partIndex + 1) % data.parts.length].id],
        tools: ["Inbusschlüssel-Set", "Drehmomentschlüssel", "Multimeter"],
        maintenanceTip:
          "Prüfe die Umgebungstemperatur und Ladezyklen alle 3 Monate für optimale Lebensdauer.",
      });
      setSelectedPart(part.id);
      setAiAnalyzing(false);
    },
    [data.parts]
  );

  const value = useMemo(
    () => ({
      product,
      data,
      mode,
      setMode,
      cameraView,
      setCameraView,
      config,
      updateConfig,
      toggleAccessory,
      specs,
      selectedHotspot,
      setSelectedHotspot,
      selectedPart,
      setSelectedPart,
      savedConfigs,
      saveCurrentConfig,
      saveStatus,
      compareConfig,
      setCompareConfig,
      aiResult,
      aiAnalyzing,
      runAIIdentification,
      explodedProgress,
      setExplodedProgress,
      hoveredPart,
      setHoveredPart,
    }),
    [
      product,
      data,
      mode,
      cameraView,
      config,
      updateConfig,
      toggleAccessory,
      specs,
      selectedHotspot,
      selectedPart,
      savedConfigs,
      saveCurrentConfig,
      saveStatus,
      compareConfig,
      aiResult,
      aiAnalyzing,
      runAIIdentification,
      explodedProgress,
      hoveredPart,
    ]
  );

  return (
    <ShowroomContext.Provider value={value}>{children}</ShowroomContext.Provider>
  );
}

export function useShowroom() {
  const ctx = useContext(ShowroomContext);
  if (!ctx) throw new Error("useShowroom must be used within ShowroomProvider");
  return ctx;
}
