import { Play, Video } from "lucide-react";
import { assetPaths } from "../data/site";
import { useAssetAvailability } from "./AssetAwareMedia";

type VideoFrameProps = {
  large?: boolean;
};

export function VideoFrame({ large = false }: VideoFrameProps) {
  const availability = useAssetAvailability(assetPaths.demoVideo);
  const isAvailable = availability === "available";

  return (
    <div
      className={`premium-panel grain-mask overflow-hidden rounded-[2rem] border gold-line ${
        large ? "min-h-[560px]" : "min-h-[440px]"
      }`}
    >
      {isAvailable ? (
        <video
          className="h-full min-h-[inherit] w-full object-cover"
          src={assetPaths.demoVideo}
          controls
          preload="metadata"
          aria-label="Demo de funcionamiento de ELCO-DEALER"
        />
      ) : (
        <div className="flex min-h-[inherit] flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 grid h-20 w-20 place-items-center rounded-full border border-casino-gold/40 bg-casino-gold/10 text-casino-gold shadow-glow">
            <Play aria-hidden="true" size={34} />
          </div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-casino-gold">
            Demo preparada
          </p>
          <h3 className="max-w-xl text-3xl font-black text-casino-ivory md:text-4xl">
            El marco final del vídeo ya está integrado.
          </h3>
          <p className="mt-5 max-w-xl text-base leading-8 text-casino-muted">
            Cuando esté listo el archivo, colócalo como{" "}
            <span className="font-mono text-casino-amber">web/public/assets/demo_video.mp4</span>.
            La web lo mostrará automáticamente con controles de reproducción.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-casino-muted">
            <Video size={16} aria-hidden="true" />
            Sin autoplay agresivo
          </div>
        </div>
      )}
    </div>
  );
}
