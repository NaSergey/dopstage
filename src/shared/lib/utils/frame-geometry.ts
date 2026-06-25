const STROKE_OFFSET = 0.5;
const HORIZONTAL_OFFSET = 19;
const DIAGONAL_OFFSET = 7.5;
const DIAGONAL_DEPTH = 4.25;

// Reference height for scaling (standard button height)
const REFERENCE_HEIGHT = 40;

// Calculate scaled constants based on height
const getScaledConstants = (height: number) => {
  // For very small heights (<= 24px), use proportional scaling
  if (height <= 24) {
    const scale = height / REFERENCE_HEIGHT;
    return {
      horizontalOffset: Math.max(height * 0.475, 8), // Minimum 8px, or 47.5% of height
      diagonalOffset: DIAGONAL_OFFSET * scale,
      diagonalDepth: DIAGONAL_DEPTH * scale,
    };
  }
  // For larger heights, use standard constants
  return {
    horizontalOffset: HORIZONTAL_OFFSET,
    diagonalOffset: DIAGONAL_OFFSET,
    diagonalDepth: DIAGONAL_DEPTH,
  };
};

export type FrameSegmentKey =
  | "topRight"
  | "bottomRight"
  | "right"
  | "topLeft"
  | "bottomLeft"
  | "left"
  | "top"
  | "bottom";

export interface FrameSegments extends Record<FrameSegmentKey, string> {
  topRight: string;
  bottomRight: string;
  right: string;
  topLeft: string;
  bottomLeft: string;
  left: string;
  top: string;
  bottom: string;
}

const createEmptySegments = (): FrameSegments => ({
  topRight: "",
  bottomRight: "",
  right: "",
  topLeft: "",
  bottomLeft: "",
  left: "",
  top: "",
  bottom: "",
});

export type FrameGeometryMode = "closed" | "openBottom";

export interface FrameGeometryInput {
  width: number;
  height: number;
  inset: number;
  bottomLineOffset?: number;
  mode?: FrameGeometryMode;
}

export interface FrameGeometryResult {
  clipPath: string;
  outlineSegments: FrameSegments;
  inset: number;
  hasGeometry: boolean;
}

export const clampFrameInset = (height: number, inset: number): number => {
  if (height <= 0) {
    return 0;
  }

  return Math.max(0, Math.min((height - 1) / 2, inset));
};

export const getFrameGeometry = ({
  width,
  height,
  inset,
  bottomLineOffset = 0,
  mode = "closed",
}: FrameGeometryInput): FrameGeometryResult => {
  if (width <= 0 || height <= 0) {
    return {
      clipPath: "",
      outlineSegments: createEmptySegments(),
      inset: 0,
      hasGeometry: false,
    };
  }

  const clampedInset = clampFrameInset(height, inset);
  const constants = getScaledConstants(height);

  if (mode === "openBottom") {
    const clipPath = [
      `M${constants.horizontalOffset} ${STROKE_OFFSET}`,
      `L${width - constants.horizontalOffset} ${STROKE_OFFSET}`,
      `L${width - constants.diagonalOffset} ${constants.diagonalDepth}`,
      `L${width - STROKE_OFFSET} ${clampedInset}`,
      `V${height}`,
      `H${STROKE_OFFSET}`,
      `V${clampedInset}`,
      `L${constants.diagonalOffset} ${constants.diagonalDepth}`,
      "Z",
    ].join(" ");

    const outlineSegments: FrameSegments = {
      topRight: `M${width - constants.horizontalOffset} ${STROKE_OFFSET}L${width - constants.diagonalOffset} ${constants.diagonalDepth}L${width - STROKE_OFFSET} ${clampedInset}`,
      bottomRight: "",
      right: `M${width - STROKE_OFFSET} ${clampedInset}V${height}`,
      topLeft: `M${constants.horizontalOffset} ${STROKE_OFFSET}L${constants.diagonalOffset} ${constants.diagonalDepth}L${STROKE_OFFSET} ${clampedInset}`,
      bottomLeft: "",
      left: `M${STROKE_OFFSET} ${clampedInset}V${height}`,
      top: `M${constants.horizontalOffset} ${STROKE_OFFSET}H${width - constants.horizontalOffset}`,
      bottom: "",
    };

    return {
      clipPath,
      outlineSegments,
      inset: clampedInset,
      hasGeometry: true,
    };
  }

  const sanitizedBottomOffset = Math.max(bottomLineOffset, 0);
  const bottomLineY = Math.max(
    STROKE_OFFSET,
    height - (STROKE_OFFSET + sanitizedBottomOffset),
  );

  const clipPath = [
    `M${constants.horizontalOffset} ${STROKE_OFFSET}`,
    `L${width - constants.horizontalOffset} ${STROKE_OFFSET}`,
    `L${width - constants.diagonalOffset} ${constants.diagonalDepth}`,
    `L${width - STROKE_OFFSET} ${clampedInset}`,
    `V${height - clampedInset}`,
    `L${width - constants.diagonalOffset} ${height - constants.diagonalDepth}`,
    `L${width - constants.horizontalOffset} ${height - STROKE_OFFSET}`,
    `H${constants.horizontalOffset}`,
    `L${constants.diagonalOffset} ${height - constants.diagonalDepth}`,
    `L${STROKE_OFFSET} ${height - clampedInset}`,
    `V${clampedInset}`,
    `L${constants.diagonalOffset} ${constants.diagonalDepth}`,
    "Z",
  ].join(" ");

  const outlineSegments: FrameSegments = {
    topRight: `M${width - constants.horizontalOffset} ${STROKE_OFFSET}L${width - constants.diagonalOffset} ${constants.diagonalDepth}L${width - STROKE_OFFSET} ${clampedInset}`,
    bottomRight: `M${width - constants.horizontalOffset} ${height - STROKE_OFFSET}L${width - constants.diagonalOffset} ${height - constants.diagonalDepth}L${width - STROKE_OFFSET} ${height - clampedInset}`,
    right: `M${width - STROKE_OFFSET} ${clampedInset}V${height - clampedInset}`,
    topLeft: `M${constants.horizontalOffset} ${STROKE_OFFSET}L${constants.diagonalOffset} ${constants.diagonalDepth}L${STROKE_OFFSET} ${clampedInset}`,
    bottomLeft: `M${constants.horizontalOffset} ${height - STROKE_OFFSET}L${constants.diagonalOffset} ${height - constants.diagonalDepth}L${STROKE_OFFSET} ${height - clampedInset}`,
    left: `M${STROKE_OFFSET} ${clampedInset}V${height - clampedInset}`,
    top: `M${constants.horizontalOffset} ${STROKE_OFFSET}H${width - constants.horizontalOffset}`,
    bottom: `M${constants.horizontalOffset} ${bottomLineY}H${width - constants.horizontalOffset}`,
  };

  return {
    clipPath,
    outlineSegments,
    inset: clampedInset,
    hasGeometry: true,
  };
};
