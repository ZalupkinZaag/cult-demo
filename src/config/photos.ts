/**
 * Фотографии студии — фактические снимки из открытой карточки 2ГИС «Культ»,
 * альбом «от владельца» (id 70000001103757622, выгрузка leads-2gis/perm.json,
 * инфраструктура 2ГИС CDN). Список — единственный вход для hero и галереи;
 * названий бизнесов здесь нет.
 */
const B = import.meta.env.BASE_URL;

export type StudioPhoto = {
  src: string;
  /** нейтральная подпись по факту кадра, без интерпретаций */
  tag: string;
};

/** Боковая панель hero: кадр этапа полировки (вертикальный). */
export const heroBackdrop: string = `${B}photos/f3.jpg`;

/** Главный кадр правой/левой колонки hero: авто после полировки (вертикальный). */
export const heroMain: string = `${B}photos/f1.jpg`;

/** Второй кадр hero: салон в процессе работ. */
export const heroSecond: string = `${B}photos/f2.jpg`;

/** Кадры галереи. */
export const gallery: StudioPhoto[] = [
  { src: `${B}photos/f1.jpg`, tag: "Полировка кузова" },
  { src: `${B}photos/f3.jpg`, tag: "Полировка кузова" },
  { src: `${B}photos/f2.jpg`, tag: "Салон после работ" },
  { src: `${B}photos/f4.jpg`, tag: "Салон после работ" },
  { src: `${B}photos/f7.jpg`, tag: "Чистка салона" },
  { src: `${B}photos/f8.jpg`, tag: "Проф. материалы" },
];
