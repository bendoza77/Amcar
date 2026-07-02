import { cn } from "../../lib/utils";
import screenHome from "../../assets/screen-home.webp";
import screenMap from "../../assets/screen-map.webp";
import screenService from "../../assets/screen-service.webp";
import screenProfile from "../../assets/screen-profile.webp";

/* Descriptive, keyword-relevant fallback alt text per screen (used when the
   caller doesn't supply its own localized alt). Never generic "image". */
const SCREEN_ALT = {
  home: "Amcar app home screen showing nearby car mechanics and saved shops",
  map: "Amcar live map of nearby trusted car mechanics with ratings and distance",
  service: "Amcar services and pricing screen comparing oil change and repair costs",
  profile: "Amcar verified mechanic profile with reviews, rating and directions",
};

/**
 * PhoneMockup — a CSS-only iPhone frame that shows a real Amcar app
 * screenshot. The image is full-bleed (object-cover) so it fills the rounded
 * device screen edge-to-edge, with the notch floating on top like a real phone.
 *
 * @param {"home"|"map"|"service"|"profile"} screen
 * @param {boolean} float      apply the idle floating animation
 * @param {string}  [alt]      override the descriptive alt text (e.g. localized)
 * @param {boolean} [priority] eager-load + high fetch priority (LCP candidate);
 *                             otherwise the image lazy-loads to save bandwidth
 */
export default function PhoneMockup({ screen = "map", float = false, alt, priority = false, className }) {
  const src = SCREENS[screen] ?? SCREENS.map;

  return (
    <div className={cn("relative mx-auto w-[270px] sm:w-[300px]", float && "animate-float", className)}>
      {/* Device frame */}
      <div className="relative rounded-[2.8rem] border border-ink/10 bg-ink p-2.5 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)]">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-card">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-ink" />

          {/* Screenshot fills the whole screen. width/height reserve space to
              keep CLS at zero; loading/fetchpriority tune LCP vs. bandwidth. */}
          <img
            src={src}
            alt={alt || SCREEN_ALT[screen] || SCREEN_ALT.map}
            width={300}
            height={572}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "auto" : "async"}
            className="h-[572px] w-full object-cover"
          />
        </div>
      </div>

      {/* Soft reflection */}
      <div className="absolute inset-x-8 -bottom-6 h-12 rounded-[50%] bg-ink/20 blur-2xl" />
    </div>
  );
}

const SCREENS = {
  home: screenHome,
  map: screenMap,
  service: screenService,
  profile: screenProfile,
};
