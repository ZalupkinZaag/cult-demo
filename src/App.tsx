import { useMemo, useState } from "react";
import business from "@/config/business.json";
import type { Booking, Service } from "@/types";
import {
  loadBookings,
  makeId,
  saveBookings,
} from "@/lib/bookings";
import { formatPrice, formatDate } from "@/lib/utils";
import { Reveal } from "@/lib/reveal";
import { HeroPhotoWall, Gallery } from "@/components/site/PhotoWall";
import { heroBackdrop } from "@/config/photos";
import { Reviews } from "@/components/site/Reviews";
import { Cabinet } from "@/components/site/Cabinet";
import {
  BookingDialog,
  nextDates,
  slotsFor,
  takenSlot,
  type Draft,
} from "@/components/site/BookingDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CheckCheck,
  Clock,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

/** Склонение «отзыв»: 1 отзыв / 2–4 отзыва / 5+ отзывов (по правилам русского). */
function pluralReviews(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "отзыва";
  return "отзывов";
}

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>(() => loadBookings());
  const [draft, setDraft] = useState<Draft>(null);
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const dates = useMemo(() => nextDates(5), []);

  /** Короткий путь: услуга → диалог с уже выбранными датой и первым свободным слотом. */
  function startBooking(service: Service) {
    const firstFree = slotsFor(service, dates[0]).find(
      (t) => !takenSlot(bookings, business.services, dates[0], t),
    );
    setDraft({
      service,
      date: dates[0],
      time: firstFree ?? "",
    });
    setOpen(true);
  }

  /** Возвращает текст ошибки или null (ошибки не выдумываем — валидация реальная). */
  function confirm(phone: string): string | null {
    if (!draft) return "Не выбрана услуга";
    if (!draft.time) return "Выберите время";
    if (!/^\+?\d{6,}$/.test(phone.replace(/[\s()-]/g, "")))
      return "Укажите корректный телефон";

    // Идемпотентность: та же дата/время/телефон не создаёт дубль
    if (
      bookings.some(
        (b) =>
          b.date === draft.date && b.time === draft.time && b.phone === phone,
      )
    ) {
      return "Такая запись уже существует (идемпотентность)";
    }

    const booking: Booking = {
      id: makeId(),
      service: draft.service.name,
      price: draft.service.price,
      date: draft.date,
      time: draft.time,
      phone,
      createdAt: Date.now(),
    };
    const next = [...bookings, booking];
    setBookings(next);
    saveBookings(next);
    setOpen(false);
    setConfirmed(booking);
    return null;
  }

  function cancel(id: string) {
    const next = bookings.filter((b) => b.id !== id);
    setBookings(next);
    saveBookings(next);
  }

  return (
    <div className="min-h-dvh">
      {/* Header: плотная нижняя панель, не «стеклянная», с якорной навигацией */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a
            href="#top"
            className="cursor-pointer font-display text-[13px] font-extrabold uppercase tracking-[0.18em] transition-colors duration-200 hover:text-muted-foreground sm:text-sm sm:tracking-[0.25em]"
          >
            {business.name.split(" ")[0]}
            <span className="max-sm:hidden">{" "}{business.name.split(" ")[1] ?? ""}</span>
          </a>
          <nav className="flex items-center gap-5 text-xs uppercase tracking-widest">
            <a
              className="hidden cursor-pointer text-muted-foreground transition-colors duration-200 hover:text-foreground sm:block"
              href="#works"
            >
              Работы
            </a>
            <a
              className="hidden cursor-pointer text-muted-foreground transition-colors duration-200 hover:text-foreground sm:block"
              href="#services"
            >
              Услуги
            </a>
            <a
              className="hidden cursor-pointer text-muted-foreground transition-colors duration-200 hover:text-foreground sm:block"
              href="#reviews"
            >
              Отзывы
            </a>
            <a
              className="hidden cursor-pointer text-muted-foreground transition-colors duration-200 hover:text-foreground sm:block"
              href="#cabinet"
            >
              Кабинет
            </a>
            <Button
              size="sm"
              className="cursor-pointer"
              onClick={() => startBooking(business.services[0])}
            >
              Записаться
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero: зеркальная вариация — фото слева (5), текст справа (7);
          фон — боковая смещённая панель с кадром этапа полировки */}
      <section id="top" className="relative isolate overflow-hidden border-b border-border">
        <div aria-hidden className="absolute inset-y-0 right-0 z-0 w-full md:w-[46%]">
          <img
            src={heroBackdrop}
            alt=""
            className="h-full w-full object-cover object-center opacity-20 md:opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background md:bg-gradient-to-r md:from-background md:via-background/50 md:to-transparent" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 sm:pb-20 sm:pt-16 md:grid-cols-12 md:gap-8 md:pt-20">
          <Reveal delayMs={120} className="order-2 max-sm:mx-auto md:order-1 md:col-span-5">
            <HeroPhotoWall />
          </Reveal>

          <div className="order-1 md:order-2 md:col-span-7">
            <Reveal>
              <p className="mb-6 text-[10px] uppercase tracking-[0.2em] break-words text-muted-foreground sm:text-xs sm:tracking-[0.35em]">
                {business.tagline} · {business.address.split(",")[0]}
              </p>
              <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight uppercase sm:text-6xl md:text-7xl xl:text-8xl">
                {business.name.split(" ")[0]}
                {business.tagline && (
                  <span className="block text-muted-foreground">{business.tagline}</span>
                )}
              </h1>
            </Reveal>
            {business.rating2gis && (
              <Reveal delayMs={50}>
                <p className="mt-5 inline-flex items-center gap-2 border border-border bg-background/70 px-3 py-1.5 text-xs uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                  <Star className="size-3.5 text-foreground" aria-hidden />
                  {"Рейтинг "}{business.rating2gis.score.toFixed(1)}
                  {" · "}{business.rating2gis.count}{" "}
                  {pluralReviews(business.rating2gis.count)}{" в 2ГИС"}
                </p>
              </Reveal>
            )}
            <Reveal delayMs={80}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="group cursor-pointer"
                  onClick={() => startBooking(business.services[0])}
                >
                  Записаться
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden
                  />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="cursor-pointer"
                >
                  <a href="#services">Прайс и услуги</a>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal
            delayMs={160}
            className="order-3 grid gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:grid-cols-3 md:col-span-12"
          >
            <span className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden /> {business.address}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" aria-hidden /> {business.phone}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden />{" "}
              {business.worksOnWeekend
                ? "ежедневно"
                : "пн–пт"}{" "}
              {business.workingHours.start}:00–{business.workingHours.end}:00
            </span>
          </Reveal>
        </div>
      </section>

      {/* Работы: реальные фото студии из карточки 2ГИС (см. src/config/photos.ts) */}
      <section id="works" className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-6 gap-y-2 px-4 pb-4 pt-12 sm:pt-16 md:pt-20">
          <h2 className="font-display text-4xl font-extrabold tracking-tight uppercase sm:text-5xl">
            Работы
          </h2>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            лента кадров · полировка, салоны, материалы
          </p>
        </div>
        <Gallery />
      </section>

      {/* Услуги: редакторский прайс-лист строками, не «3 карточки по центру» */}
      <section id="services" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20">
          <Reveal className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <h2 className="font-display text-4xl font-extrabold tracking-tight uppercase sm:text-5xl">
              Услуги
            </h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              демо-прайс: поставим ваши цены и услуги
            </p>
          </Reveal>

          <ul className="border-t border-border">
            {business.services.map((s, i) => (
              <li key={s.name}>
                <Reveal delayMs={i * 50}>
                  <div className="group grid cursor-pointer grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-baseline gap-x-4 border-b border-border py-5 transition-colors duration-200 hover:bg-card sm:gap-x-8 sm:grid-cols-[3rem_1fr_auto_auto_auto] sm:grid-rows-1 sm:items-center">
                    <span
                      className="font-display text-sm font-bold text-muted-foreground row-start-1 sm:col-start-1 sm:row-start-1"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="col-start-2 row-start-1 sm:col-start-2">
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight sm:text-xl">
                        {s.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                    <span className="col-start-1 row-start-2 mt-1 text-xs uppercase tracking-widest text-muted-foreground sm:col-start-3 sm:row-start-1 sm:mt-0 sm:text-right">
                      {s.duration % 60 === 0 ? `${s.duration / 60} ч` : `${s.duration} мин`}
                    </span>
                    <span className="col-start-3 row-start-1 font-display text-2xl font-bold tabular-nums sm:col-start-4 sm:row-start-1 sm:text-3xl">
                      {formatPrice(s.price)}
                    </span>
                    <span className="col-start-2 row-start-2 mt-1 sm:col-start-5 sm:row-start-1 sm:mt-0">
                      <Button
                        size="sm"
                        className="group/btn cursor-pointer"
                        onClick={() => startBooking(s)}
                      >
                        <CalendarCheck className="size-4" aria-hidden />
                        Записаться
                        <ArrowUpRight
                          className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                          aria-hidden
                        />
                      </Button>
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Reviews />

      <Cabinet bookings={bookings} onCancel={cancel} />

      {/* Footer: только данные из business.json + честный демо-маркер */}
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-lg font-extrabold uppercase tracking-[0.25em]">
              {business.name}
            </p>
            <p className="mt-2 max-w-xs text-muted-foreground">
              {business.tagline}. {business.address}
            </p>
          </div>
          <div className="grid gap-1 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Phone className="size-4" aria-hidden /> {business.phone}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4" aria-hidden /> пн–пт,{" "}
              {business.workingHours.start}:00–{business.workingHours.end}:00
            </span>
          </div>
          <p className="w-full max-w-xs text-xs leading-relaxed text-muted-foreground">
            Демо-версия сайта онлайн-записи: прайс, часы работы и отзывы —
            заглушки; фото — открытая карточка 2ГИС (альбом «от владельца»);
            адрес, телефон и рейтинг — из той же карточки. Тестовая ссылка,
            для обсуждения.
          </p>
        </div>
      </footer>

      <BookingDialog
        open={open}
        draft={draft}
        dates={dates}
        bookings={bookings}
        onDraftChange={(d) => {
          setDraft(d);
        }}
        onOpenChange={(v) => {
          setOpen(v);
        }}
        onConfirm={confirm}
      />

      <Dialog
        open={confirmed !== null}
        onOpenChange={(v) => !v && setConfirmed(null)}
      >
        <DialogContent className="max-w-sm bg-card p-0 text-center">
          <div className="flex flex-col items-center gap-3 px-6 pb-4 pt-8">
            <span className="flex size-14 items-center justify-center border border-ring/60 bg-secondary">
              <CheckCheck className="size-7 text-foreground" aria-hidden />
            </span>
            <DialogHeader className="space-y-1">
              <DialogTitle className="font-display uppercase tracking-tight">
                Запись создана
              </DialogTitle>
              <DialogDescription>
                {confirmed &&
                  `${confirmed.service} · ${formatDate(confirmed.date)} · ${confirmed.time}`}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="border-t border-border bg-muted px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground">
            id {confirmed?.id.slice(0, 8)}
          </div>
          <DialogFooter className="border-t border-border px-6 py-4 sm:justify-center">
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => setConfirmed(null)}
            >
              Готово
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
