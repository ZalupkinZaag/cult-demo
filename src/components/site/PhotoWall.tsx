import { cn } from "@/lib/utils";
import {
  gallery,
  heroBackdrop,
  heroMain,
  heroSecond,
  type StudioPhoto,
} from "@/config/photos";
import { Camera, MoveRight } from "lucide-react";

/**
 * Фото студии — реальные снимки из открытой карточки 2ГИС «от владельца»
 * (см. src/config/photos.ts). Композиция: вертикальный кадр в героe
 * и горизонтальная лента-стрин галереи вместо сетки.
 */

/** Левая колонка hero: вертикальный кадр полировки + наложение салона. */
export function HeroPhotoWall({ className }: { className?: string }) {
  return (
    <figure className={cn("relative mx-auto w-full max-w-md md:max-w-none", className)}>
      <span
        className="absolute -right-2 -top-2 z-10 h-10 w-10 border-r border-t border-ring/50"
        aria-hidden
      />
      <span
        className="absolute -bottom-2 -left-2 z-10 h-10 w-10 border-b border-l border-ring/50"
        aria-hidden
      />
      <div className="relative overflow-hidden border border-border">
        <img
          src={heroMain}
          alt="Авто после полировки"
          loading="eager"
          className="photo-grain aspect-[3/4] w-full object-cover"
        />
        <span className="absolute right-3 top-3 border border-border bg-background/80 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/90 backdrop-blur-sm">
          после полировки
        </span>
      </div>
      <div className="relative z-10 mr-[16%] -mt-[14%] w-[58%] overflow-hidden border border-border shadow-2xl shadow-black/60">
        <img
          src={heroSecond}
          alt="Салон после работ"
          loading="lazy"
          className="photo-grain aspect-[4/3] w-full object-cover"
        />
      </div>
      <figcaption className="mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
        <Camera className="size-3.5" aria-hidden />
        фото — открытая карточка студии в 2ГИС
      </figcaption>
    </figure>
  );
}

/** Секция «Работы»: горизонтальная лента со snap-прокруткой. */
export function Gallery() {
  return (
    <div className="pb-12 sm:pb-16 md:pb-20">
      <ul
        className="
          flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-ps-4 px-4 pb-3 sm:gap-3
          [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent]
        "
      >
        {gallery.map((p, i) => (
          <Tile
            key={p.src}
            photo={p}
            index={i + 1}
            className="w-[74%] shrink-0 snap-start sm:w-[46%] md:w-[24%]"
          />
        ))}
      </ul>
      <div className="mx-auto mt-2 flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4">
        <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
          <Camera className="size-3.5" aria-hidden />
          альбом «от владельца», карточка 2ГИС · свои работы заменяете сами
        </p>
        <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground max-sm:hidden">
          листайте
          <MoveRight className="size-3.5" aria-hidden />
        </p>
      </div>
    </div>
  );
}

function Tile({
  photo,
  index,
  className,
}: {
  photo: StudioPhoto;
  index: number;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "group relative overflow-hidden border border-border",
        className,
      )}
    >
      <img
        src={photo.src}
        alt={photo.tag}
        loading={index === 1 ? "eager" : "lazy"}
        className="photo-grain h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <span className="absolute right-3 top-3 font-display text-xs font-bold uppercase tracking-[0.3em] text-foreground/70">
        {String(index).padStart(2, "0")}
      </span>
      <span className="absolute bottom-3 left-3 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/90">
        {photo.tag}
      </span>
    </li>
  );
}

export { heroBackdrop };
