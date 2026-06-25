import { AppImage } from "@/shared/ui/app-image";
import { FallbackOctagon } from "@/shared/ui/icons";

interface IMultiUsersImagesProps {
  logos: string[];
  width?: number;
  height?: number;
}

function MultiUsersImages({
  logos,
  width = 24,
  height = 24,
}: IMultiUsersImagesProps) {
  return (
    <div className="flex items-center">
      {logos.length === 0 ? (
        <FallbackOctagon
          width={width}
          height={height}
          className="mask-octagon-rotated"
        />
      ) : (
        logos.map((logo, index) => (
          <AppImage
            key={index}
            src={logo}
            alt={`User ${index + 1}`}
            width={width}
            height={height}
            className="mask-octagon-rotated"
            fallbackVariant="octagonRotated"
            style={{
              marginLeft: index > 0 ? "-12px" : "0",
              zIndex: 10 - index,
            }}
          />
        ))
      )}
    </div>
  );
}

export default MultiUsersImages;
