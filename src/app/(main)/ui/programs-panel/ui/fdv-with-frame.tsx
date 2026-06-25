import { TddIcon } from "@/shared/ui/icons";

const GIF_URL = "/fon-frame-icon.gif";
const FRAME_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='85' height='26' viewBox='0 0 85 26' fill='none'%3E%3Cpath d='M4.90698 1H80.093L84 5.11111V20.8889L80.093 25H4.90698L1 20.8889V5.11111L4.90698 1Z' stroke='white' stroke-width='1.2'/%3E%3C/svg%3E\")";
const LOGO_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='11' viewBox='0 0 22 11' fill='none'%3E%3Cpath d='M22 10H10L12.9385 9.04492L14.7549 6.54492V3.45508L12.9385 0.955078L10 0L7.06152 0.955078L5.24512 3.45508V6.54492L7.06152 9.04492L10 10H0V0H22V10ZM0.700195 2.7998H2.2002V8.7998H3.7998V2.7998H5.2998V1.2002H0.700195V2.7998ZM15.2002 8.7998H19.3311L20.7998 7.33105V2.66895L19.3311 1.2002H15.2002V8.7998ZM10.1494 2.375L10.2871 2.43164L11.6133 2.98145L11.8994 3.10059L12.0186 3.38672L12.5684 4.71289L12.6865 5L12.5684 5.28711L12.0186 6.61328L11.8994 6.89941L11.6133 7.01855L10.2871 7.56836L10.1494 7.625H8V2.375H10.1494ZM19.2002 3.33105V6.66895L18.6689 7.2002H16.7998V2.7998H18.6689L19.2002 3.33105ZM9.5 3.875V6.125H9.84961L10.751 5.75098L11.0625 5L10.751 4.24805L9.84961 3.875H9.5Z' fill='white'/%3E%3C/svg%3E\")";

const frameMaskStyle = {
  maskImage: FRAME_MASK,
  // Increase width to prevent right side clipping
  maskSize: "105% 100%",
  maskPosition: "left center",
  maskRepeat: "no-repeat",
  WebkitMaskImage: FRAME_MASK,
  WebkitMaskSize: "100% 100%",
  WebkitMaskPosition: "left center",
  WebkitMaskRepeat: "no-repeat",
} as const;

const logoMaskStyle = {
  maskImage: LOGO_MASK,
  maskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskImage: LOGO_MASK,
  WebkitMaskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
} as const;

type Props = {
  value: string;
  animated?: boolean;
  gray?: boolean;
};

export function FdvWithFrame({ value, animated = false, gray = false }: Props) {
  const hasFrame = animated || gray;
  const isAnimated = animated && !gray;

  const frameStyle = {
    backgroundImage: isAnimated ? `url(${GIF_URL})` : undefined,
    backgroundColor: isAnimated ? undefined : "#3f3f46",
    backgroundSize: "cover",
    backgroundPosition: "center",
    ...frameMaskStyle,
  };

  const logoStyle = {
    left: "7.06%",
    width: "31.47%",
    height: "55%",
    backgroundImage: isAnimated ? `url(${GIF_URL})` : undefined,
    backgroundColor: isAnimated ? undefined : "#52525b",
    backgroundSize: "cover",
    backgroundPosition: "center",
    ...logoMaskStyle,
  };

  return (
    <div className={`relative w-full h-[26px] flex items-center justify-end pr-1 gap-1 pointer-events-none select-none ${hasFrame ? '' : 'pr-1'}`}>
      {/* Frame background - only when needed */}
      {hasFrame && (
        <>
          <div className="absolute inset-0 pointer-events-none z-0" style={frameStyle} />
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0 aspect-[24/11]"
            style={logoStyle}
          />
        </>
      )}

      {/* Content overlay */}
      {!hasFrame && <TddIcon className="w-[22px] h-[12px] shrink-0" />}

      <span className="text-white text-xs leading-none">{value}</span>
    </div>
  );
}
