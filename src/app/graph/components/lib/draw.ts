import * as d3 from "d3";
import type { ApiSimLink, ApiSimNode } from "../model/types";
import { nodeR } from "./helpers";

const MAX_VISIBLE_CONNECTIONS = 8;
const TWO_PI = Math.PI * 2;

function linkVisible(l: ApiSimLink, connectionCount: Map<string, number>): boolean {
  const s = l.source as ApiSimNode;
  const t = l.target as ApiSimNode;
  return (connectionCount.get(s.id) ?? 0) <= MAX_VISIBLE_CONNECTIONS
    || (connectionCount.get(t.id) ?? 0) <= MAX_VISIBLE_CONNECTIONS;
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  simNodes: ApiSimNode[],
  simLinks: ApiSimLink[],
  hov: ApiSimNode | null,
  transform: d3.ZoomTransform,
  images: Map<string, HTMLImageElement>,
  adjacency: Map<string, Set<string>>,
  colorMap: Map<string, string>,
  connectionCount: Map<string, number>,
  maxConnections: number,
  nodeMap: Map<string, ApiSimNode>,
) {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  ctx.translate(transform.x, transform.y);
  ctx.scale(transform.k, transform.k);

  // ── links ──────────────────────────────────────────────────────────────
  if (!hov) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 0.6 / transform.k;
    simLinks.forEach(l => {
      if (!linkVisible(l, connectionCount)) return;
      const s = l.source as ApiSimNode;
      const t = l.target as ApiSimNode;
      ctx.moveTo(s.x ?? 0, s.y ?? 0);
      ctx.lineTo(t.x ?? 0, t.y ?? 0);
    });
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5 / transform.k;
    simLinks.forEach(l => {
      const s = l.source as ApiSimNode;
      const t = l.target as ApiSimNode;
      if (s.id !== hov.id && t.id !== hov.id && linkVisible(l, connectionCount)) {
        ctx.moveTo(s.x ?? 0, s.y ?? 0);
        ctx.lineTo(t.x ?? 0, t.y ?? 0);
      }
    });
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 1.5 / transform.k;
    simLinks.forEach(l => {
      const s = l.source as ApiSimNode;
      const t = l.target as ApiSimNode;
      if (s.id === hov.id || t.id === hov.id) {
        ctx.moveTo(s.x ?? 0, s.y ?? 0);
        ctx.lineTo(t.x ?? 0, t.y ?? 0);
      }
    });
    ctx.stroke();
  }

  // ── nodes — pass 1: circles ────────────────────────────────────────────
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "low";
  simNodes.forEach(node => {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const connections = connectionCount.get(node.id) ?? 0;
    const baseSizeFactor = 1 + (connections / maxConnections) * 0.25;
    const r = nodeR(node.rankNorm) * baseSizeFactor;
    const isHov = hov?.id === node.id;
    const isNeighbour = hov && !isHov && (adjacency.get(hov.id)?.has(node.id) ?? false);
    const isDimmed = hov && !isHov && !isNeighbour;
    const dr = isHov ? r * 1.22 : r;
    const color = colorMap.get(node.id) ?? "#9CA3AF";
    const img = images.get(node.id);

    // ── halo (hovered only) ──────────────────────────────────────────
    if (isHov) {
      ctx.beginPath();
      ctx.arc(x, y, dr + 8, 0, TWO_PI);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.18;
      ctx.fill();
    }

    const nodeAlpha = isDimmed ? 0.3 : isHov ? 1 : 0.8;
    const borderAlpha = isDimmed ? 0.1 : isHov ? 1 : 0.85;

    // ── background fill: only for hovered/neighbour nodes to cover links ──
    if (isHov || isNeighbour) {
      ctx.beginPath();
      ctx.arc(x, y, dr, 0, TWO_PI);
      ctx.fillStyle = "#09090B";
      ctx.globalAlpha = 1;
      ctx.fill();
    }

    if (img) {
      // ── image: clip + draw, then separate border arc ─────────────
      ctx.save();
      ctx.globalAlpha = nodeAlpha;
      ctx.beginPath();
      ctx.arc(x, y, dr, 0, TWO_PI);
      ctx.clip();
      ctx.drawImage(img, x - dr, y - dr, dr * 2, dr * 2);
      ctx.restore();
      // border — new arc needed after restore removes clip
      ctx.beginPath();
      ctx.arc(x, y, dr, 0, TWO_PI);
    } else {
      // ── no image: fill + stroke on same path (1 arc instead of 2) ─
      ctx.beginPath();
      ctx.arc(x, y, dr, 0, TWO_PI);
      ctx.fillStyle = color;
      ctx.globalAlpha = nodeAlpha;
      ctx.fill();
    }

    // ── border (reuses current path for non-image nodes) ─────────────
    ctx.strokeStyle = color;
    ctx.lineWidth = (isHov ? 3 : 2) / transform.k;
    ctx.globalAlpha = borderAlpha;
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // ── nodes — pass 2: labels ────────────────────────────────────────────
  if (hov) {
    const fontSize = Math.max(9, 11 / transform.k);
    const fontHov = `600 ${fontSize}px sans-serif`;
    const fontNeighbour = `400 ${fontSize}px sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

    // hovered node label
    const hovConnections = connectionCount.get(hov.id) ?? 0;
    const hovDr = nodeR(hov.rankNorm) * (1 + (hovConnections / maxConnections) * 0.25) * 1.22;
    ctx.font = fontHov;
    ctx.globalAlpha = 1;
    ctx.fillText(hov.displayName, hov.x ?? 0, (hov.y ?? 0) + hovDr + fontSize + 3);

    // neighbour labels — iterate Set directly, no array allocation
    ctx.font = fontNeighbour;
    ctx.globalAlpha = 0.7;
    adjacency.get(hov.id)?.forEach(id => {
      const node = nodeMap.get(id);
      if (!node) return;
      const connections = connectionCount.get(id) ?? 0;
      const dr = nodeR(node.rankNorm) * (1 + (connections / maxConnections) * 0.25);
      ctx.fillText(node.displayName, node.x ?? 0, (node.y ?? 0) + dr + fontSize + 3);
    });
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}
