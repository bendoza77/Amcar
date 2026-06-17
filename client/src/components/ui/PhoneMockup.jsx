import {
  MapPin,
  Star,
  Search,
  Navigation,
  Wrench,
  ChevronRight,
  ShieldCheck,
  Heart,
  Wifi,
  BatteryFull,
  SignalHigh,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "../../lib/utils";

/**
 * PhoneMockup — a self-contained, CSS-only iPhone frame that renders one of
 * several fake ხოდზე app screens. Used across Hero, AppShowcase, and the
 * Download CTA so the device UI stays perfectly consistent everywhere.
 *
 * @param {"home"|"map"|"service"|"profile"} screen
 * @param {boolean} float   apply the idle floating animation
 */
export default function PhoneMockup({ screen = "map", float = false, className }) {
  const Screen = SCREENS[screen] ?? SCREENS.map;

  return (
    <div className={cn("relative mx-auto w-[270px] sm:w-[300px]", float && "animate-float", className)}>
      {/* Device frame */}
      <div className="relative rounded-[2.8rem] border border-ink/10 bg-ink p-2.5 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-white">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-ink" />

          {/* Status bar */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-3.5 pb-1 text-[11px] font-semibold text-ink">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <SignalHigh className="size-3.5" />
              <Wifi className="size-3.5" />
              <BatteryFull className="size-4" />
            </div>
          </div>

          {/* Screen content */}
          <div className="h-[520px] overflow-hidden">
            <Screen />
          </div>
        </div>
      </div>

      {/* Soft reflection */}
      <div className="absolute inset-x-8 -bottom-6 h-12 rounded-[50%] bg-ink/20 blur-2xl" />
    </div>
  );
}

/* ---------- Reusable bits ---------- */

function AppHeader({ title, subtitle }) {
  return (
    <div className="px-5 pt-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">{subtitle}</p>
      <h3 className="text-[19px] font-extrabold tracking-tight text-ink">{title}</h3>
    </div>
  );
}

function SearchBar({ placeholder }) {
  return (
    <div className="mx-5 mt-3 flex items-center gap-2 rounded-2xl bg-surface px-3.5 py-2.5 ring-1 ring-line">
      <Search className="size-4 text-text-muted" />
      <span className="text-[12px] text-text-muted">{placeholder}</span>
    </div>
  );
}

function Stars({ rating = 5, className }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <Star className="size-3 fill-accent text-accent" />
      <span className="text-[11px] font-bold text-ink">{rating.toFixed(1)}</span>
    </span>
  );
}

function MechanicRow({ name, meta, price, rating, accent }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
      <div
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl text-white",
          accent ? "bg-accent" : "bg-ink"
        )}
      >
        <Wrench className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-ink">{name}</p>
        <p className="truncate text-[11px] text-text-muted">{meta}</p>
      </div>
      <div className="text-right">
        <Stars rating={rating} />
        <p className="text-[11px] font-semibold text-ink">{price}</p>
      </div>
    </div>
  );
}

/* ---------- Screens ---------- */

function HomeScreen() {
  const { t } = useTranslation();
  const h = t.phone.home;
  const actionIcons = [Wrench, MapPin, ShieldCheck];
  const ratings = [4.9, 4.8, 4.7];

  return (
    <div className="flex h-full flex-col gap-3 pb-5">
      <AppHeader subtitle={h.greeting} title={h.title} />
      <SearchBar placeholder={h.search} />

      {/* Quick actions */}
      <div className="mx-5 grid grid-cols-3 gap-2">
        {h.actions.map((label, i) => {
          const Icon = actionIcons[i];
          return (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface py-3 ring-1 ring-line">
              <Icon className="size-5 text-accent" />
              <span className="text-[10px] font-semibold text-ink">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="mx-5 mt-1 flex items-center justify-between">
        <span className="text-[12px] font-bold text-ink">{h.nearYou}</span>
        <span className="text-[11px] font-semibold text-accent">{h.seeAll}</span>
      </div>

      <div className="mx-5 flex flex-col gap-2">
        {h.shops.map((shop, i) => (
          <MechanicRow
            key={shop.name}
            name={shop.name}
            meta={`${shop.meta} · ${h.open}`}
            price={shop.price}
            rating={ratings[i]}
            accent={i === 0}
          />
        ))}
      </div>
    </div>
  );
}

function MapScreen() {
  const { t } = useTranslation();
  const m = t.phone.map;
  return (
    <div className="relative h-full">
      {/* Faux map */}
      <div className="absolute inset-0 bg-surface">
        <div className="absolute inset-0 bg-grid opacity-70" />
        {/* roads */}
        <div className="absolute left-0 top-1/3 h-3 w-full -rotate-6 bg-white" />
        <div className="absolute left-1/4 top-0 h-full w-3 rotate-3 bg-white" />
        <div className="absolute right-8 top-0 h-full w-2 bg-white/80" />
        {/* route */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 520" fill="none">
          <path
            d="M70 470 C 120 380, 60 280, 150 220 S 230 120, 200 60"
            stroke="#FF6B00"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="2 12"
          />
        </svg>

        {/* Pins */}
        <Pin className="left-[28%] top-[26%]" active />
        <Pin className="left-[60%] top-[40%]" />
        <Pin className="left-[40%] top-[58%]" />
        <Pin className="left-[70%] top-[68%]" />
      </div>

      {/* Floating card */}
      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-line bg-white p-3.5 shadow-lift">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-accent text-white">
            <Wrench className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-ink">{m.name}</p>
            <p className="text-[11px] text-text-muted">{m.distance}</p>
          </div>
          <Stars rating={4.9} />
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-[12px] font-bold text-white">
          <Navigation className="size-4" /> {m.navigate}
        </div>
      </div>
    </div>
  );
}

function Pin({ className, active }) {
  return (
    <div className={cn("absolute -translate-x-1/2 -translate-y-full", className)}>
      <div
        className={cn(
          "grid size-8 place-items-center rounded-full text-white shadow-lg ring-4",
          active ? "bg-accent ring-accent/25" : "bg-ink ring-ink/15"
        )}
      >
        <MapPin className="size-4" />
      </div>
      {active && (
        <span className="absolute left-1/2 top-1/2 -z-10 size-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-accent/30" />
      )}
    </div>
  );
}

function ServiceScreen() {
  const { t } = useTranslation();
  const s = t.phone.service;
  return (
    <div className="flex h-full flex-col gap-3 pb-5">
      <AppHeader subtitle={s.shop} title={s.title} />
      <div className="mx-5 flex items-center gap-2 text-[11px] text-text-muted">
        <Stars rating={4.9} />
        <span>· {s.reviews}</span>
      </div>

      <div className="mx-5 flex flex-col gap-2">
        {s.items.map((item, i) => (
          <div
            key={item.name}
            className={cn(
              "flex items-center justify-between rounded-2xl border p-3.5",
              i === 0 ? "border-accent/40 bg-accent/5" : "border-line bg-white"
            )}
          >
            <div>
              <p className="text-[13px] font-bold text-ink">{item.name}</p>
              <p className="text-[11px] text-text-muted">{s.starting} · {item.time}</p>
            </div>
            <div className="text-right">
              <p className="text-[15px] font-extrabold text-ink">{item.price}</p>
              {i === 0 && <p className="text-[10px] font-semibold text-success">{s.bestPrice}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-auto flex items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-[13px] font-bold text-white">
        {s.compare} <ChevronRight className="size-4" />
      </div>
    </div>
  );
}

function ProfileScreen() {
  const { t } = useTranslation();
  const p = t.phone.profile;
  return (
    <div className="flex h-full flex-col pb-5">
      {/* Cover */}
      <div className="relative h-28 bg-gradient-to-br from-ink to-ink-soft">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <button className="absolute right-4 top-3 grid size-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
          <Heart className="size-4" />
        </button>
      </div>

      <div className="-mt-8 px-5">
        <div className="grid size-16 place-items-center rounded-2xl border-4 border-white bg-accent text-white shadow-lift">
          <Wrench className="size-7" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <h3 className="text-[18px] font-extrabold tracking-tight text-ink">{p.name}</h3>
          <span className="grid size-5 place-items-center rounded-full bg-success/15 text-success">
            <ShieldCheck className="size-3.5" />
          </span>
        </div>
        <p className="text-[12px] text-text-muted">{p.status}</p>
      </div>

      {/* Stats */}
      <div className="mx-5 mt-4 grid grid-cols-3 overflow-hidden rounded-2xl ring-1 ring-line">
        {p.stats.map((stat, i) => (
          <div key={stat.k} className={cn("py-3 text-center", i < 2 && "border-r border-line")}>
            <p className="text-[15px] font-extrabold text-ink">{stat.v}</p>
            <p className="text-[10px] text-text-muted">{stat.k}</p>
          </div>
        ))}
      </div>

      {/* Review */}
      <div className="mx-5 mt-3 rounded-2xl bg-surface p-3.5 ring-1 ring-line">
        <Stars rating={5} />
        <p className="mt-1.5 text-[11px] leading-relaxed text-text-muted">{p.review}</p>
        <p className="mt-2 text-[11px] font-bold text-ink">{p.reviewer}</p>
      </div>

      <div className="mx-5 mt-auto flex items-center justify-center gap-2 rounded-2xl bg-ink py-3 text-[13px] font-bold text-white">
        <Navigation className="size-4" /> {p.directions}
      </div>
    </div>
  );
}

const SCREENS = {
  home: HomeScreen,
  map: MapScreen,
  service: ServiceScreen,
  profile: ProfileScreen,
};
