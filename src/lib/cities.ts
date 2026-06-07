export interface KZCity {
  name: string;
  lat: number;
  lng: number;
  region?: string;
  slug: string; // for 2gis.kz URL
}

/* Все значимые города Казахстана с координатами */
export const KZ_CITIES: KZCity[] = [
  { name: "Алматы",            lat: 43.2220, lng: 76.8512, region: "Алматы",                  slug: "almaty" },
  { name: "Астана",            lat: 51.1801, lng: 71.4460, region: "Акмолинская",              slug: "astana" },
  { name: "Шымкент",           lat: 42.3000, lng: 69.6000, region: "Шымкент",                  slug: "shymkent" },
  { name: "Атырау",            lat: 47.1167, lng: 51.8833, region: "Атырауская",               slug: "atyrau" },
  { name: "Актобе",            lat: 50.2839, lng: 57.1670, region: "Актюбинская",              slug: "aktobe" },
  { name: "Тараз",             lat: 42.9000, lng: 71.3667, region: "Жамбылская",               slug: "taraz" },
  { name: "Павлодар",          lat: 52.2873, lng: 76.9674, region: "Павлодарская",             slug: "pavlodar" },
  { name: "Усть-Каменогорск",  lat: 49.9775, lng: 82.6161, region: "ВКО",                     slug: "ust-kamenogorsk" },
  { name: "Семей",             lat: 50.4119, lng: 80.2275, region: "Абайская",                 slug: "semey" },
  { name: "Костанай",          lat: 53.2144, lng: 63.6363, region: "Костанайская",             slug: "kostanay" },
  { name: "Кызылорда",         lat: 44.8529, lng: 65.5093, region: "Кызылординская",           slug: "kyzylorda" },
  { name: "Уральск",           lat: 51.2333, lng: 51.3667, region: "ЗКО",                     slug: "uralsk" },
  { name: "Петропавловск",     lat: 54.8667, lng: 69.1667, region: "Северо-Казахстанская",    slug: "petropavlovsk" },
  { name: "Актау",             lat: 43.6500, lng: 51.1667, region: "Мангистауская",            slug: "aktau" },
  { name: "Темиртау",          lat: 50.0535, lng: 72.9623, region: "Карагандинская",           slug: "temirtau" },
  { name: "Туркестан",         lat: 43.2985, lng: 68.2675, region: "Туркестанская",            slug: "turkestan" },
  { name: "Кокшетау",          lat: 53.2833, lng: 69.3833, region: "Акмолинская",              slug: "kokshetau" },
  { name: "Талдыкорган",       lat: 45.0165, lng: 78.3754, region: "Жетісу",                  slug: "taldykorgan" },
  { name: "Экибастуз",         lat: 51.7198, lng: 75.3214, region: "Павлодарская",             slug: "ekibastuz" },
  { name: "Рудный",            lat: 52.9674, lng: 63.1183, region: "Костанайская",             slug: "rudny" },
  { name: "Жезказган",         lat: 47.7983, lng: 67.7146, region: "Улытауская",               slug: "zhezkazgan" },
  { name: "Балхаш",            lat: 46.8333, lng: 74.9667, region: "Карагандинская",           slug: "balkhash" },
  { name: "Лисаковск",         lat: 52.5500, lng: 62.5000, region: "Костанайская",             slug: "lisakovsk" },
  { name: "Жанаозен",          lat: 43.3500, lng: 52.8500, region: "Мангистауская",            slug: "zhanaozen" },
  { name: "Степногорск",       lat: 52.3442, lng: 71.8892, region: "Акмолинская",              slug: "stepnogorsk" },
  { name: "Риддер",            lat: 50.3583, lng: 83.5122, region: "ВКО",                     slug: "ridder" },
  { name: "Сатпаев",           lat: 47.9000, lng: 67.5333, region: "Улытауская",               slug: "satpaev" },
  { name: "Кентау",            lat: 43.5167, lng: 68.5000, region: "Туркестанская",            slug: "kentau" },
  { name: "Арысь",             lat: 42.4333, lng: 68.8167, region: "Туркестанская",            slug: "arys" },
  { name: "Каратау",           lat: 43.1833, lng: 70.4667, region: "Жамбылская",               slug: "karatau" },
  { name: "Жаркент",           lat: 44.1667, lng: 80.0000, region: "Жетісу",                  slug: "zharkent" },
  { name: "Шу",                lat: 43.5950, lng: 73.7619, region: "Жамбылская",               slug: "shu" },
  { name: "Форт-Шевченко",     lat: 44.5167, lng: 50.2667, region: "Мангистауская",            slug: "fort-shevchenko" },
  { name: "Кульсары",          lat: 46.9833, lng: 54.0167, region: "Атырауская",               slug: "kulsary" },
  { name: "Аксай",             lat: 51.1667, lng: 53.0000, region: "ЗКО",                     slug: "aksai" },
];

export function citySlug(cityName: string): string {
  return KZ_CITIES.find(c => c.name === cityName)?.slug ?? "almaty";
}

export const DEFAULT_CITY = "Алматы";

/* Haversine distance in km */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* Returns the nearest KZ city name for given coordinates */
export function nearestCity(lat: number, lng: number): string {
  let best = KZ_CITIES[0];
  let bestDist = haversine(lat, lng, best.lat, best.lng);
  for (const city of KZ_CITIES.slice(1)) {
    const d = haversine(lat, lng, city.lat, city.lng);
    if (d < bestDist) { bestDist = d; best = city; }
  }
  return best.name;
}
