"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { ApiLink, ApiNode, ApiSimLink, ApiSimNode } from "../model/types";
import { buildSimulation } from "./simulation";
import { buildColorMap, buildAdjacency, nodeAt, nodeR } from "./helpers";
import { drawFrame } from "./draw";

interface GraphData {
  nodes: ApiNode[];
  links: ApiLink[];
}

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" fill="white"/><path d="M12 1.5L19.4246 4.57538L22.5 12L19.4246 19.4246L12 22.5L4.57538 19.4246L1.5 12L4.57538 4.57538L12 1.5Z" stroke="#52525B" stroke-width="2"/><path d="M8 14.5L9.99989 12.5H14L16.0001 14.5" stroke="#52525B" stroke-width="1.6"/><circle cx="10" cy="9" r="1" fill="#52525B"/><circle cx="14" cy="9" r="1" fill="#52525B"/></svg>`;

export function useUserGraph(data: GraphData) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<ApiNode | null>(null);
  const [selected, setSelected] = useState<ApiNode | null>(null);
  const [loading, setLoading] = useState(true);
  const hoveredRef = useRef<ApiSimNode | null>(null);
  const panelHoveredRef = useRef<ApiSimNode | null>(null);
  const dragging = useRef<ApiSimNode | null>(null);
  const mouseDownPos = useRef<[number, number] | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const nodeMapRef = useRef<Map<string, ApiSimNode>>(new Map());
  const scheduleDrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const container = containerRef.current;
    if (!canvasEl || !container) return;

    let W = container.clientWidth;
    let H = container.clientHeight;

    const dpr = window.devicePixelRatio || 1;
    canvasEl.width = W * dpr;
    canvasEl.height = H * dpr;
    canvasEl.style.width = `${W}px`;
    canvasEl.style.height = `${H}px`;

    const ctx = canvasEl.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const sortedByRank = [...data.nodes].sort((a, b) => (b.pageRank ?? 0) - (a.pageRank ?? 0));
    const rankNormMap = new Map(sortedByRank.map((n, i) => [n.id, i / Math.max(sortedByRank.length - 1, 1)]));
    const simNodes: ApiSimNode[] = data.nodes.map(n => ({ ...n, rankNorm: rankNormMap.get(n.id)! }));
    const simLinks: ApiSimLink[] = data.links.map(l => ({ ...l } as ApiSimLink));

    const connectionCount = new Map<string, number>();
    data.links.forEach(l => {
      connectionCount.set(l.source, (connectionCount.get(l.source) ?? 0) + 1);
      connectionCount.set(l.target, (connectionCount.get(l.target) ?? 0) + 1);
    });
    const maxConnections = Math.max(...Array.from(connectionCount.values()), 1);
    simNodes.forEach(n => { n.degree = connectionCount.get(n.id) ?? 0; });
    const colorMap = buildColorMap(simNodes);

    let rafId = 0;
    let adjacency: Map<string, Set<string>> = new Map();
    const nodeMap: Map<string, ApiSimNode> = new Map();
    nodeMapRef.current = nodeMap;
    let simulation: d3.Simulation<ApiSimNode, ApiSimLink> | null = null;

    function draw() {
      const effectiveHov = hoveredRef.current ?? panelHoveredRef.current;
      drawFrame(ctx, W, H, simNodes, simLinks, effectiveHov, transformRef.current, imagesRef.current, adjacency, colorMap, connectionCount, maxConnections, nodeMap);
    }

    function scheduleDraw() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { rafId = 0; draw(); });
    }
    scheduleDrawRef.current = scheduleDraw;

    // ── zoom / pan ──────────────────────────────────────────────────
    const initialScale = 0.12;
    const initialTransform = d3.zoomIdentity
      .translate(W / 2 * (1 - initialScale), H / 2 * (1 - initialScale))
      .scale(initialScale);
    transformRef.current = initialTransform;

    const zoomBehavior = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.05, 10])
      .filter(event => {
        if (event.type === "mousedown") return !hoveredRef.current;
        return !event.ctrlKey && event.button === 0;
      })
      .on("zoom", (event: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
        transformRef.current = event.transform;
        scheduleDraw();
      });

    d3.select(canvasEl).call(zoomBehavior).call(zoomBehavior.transform, initialTransform);

    // ── mouse events ────────────────────────────────────────────────
    function canvasPos(e: MouseEvent): [number, number] {
      const rect = canvasEl!.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top];
    }

    function onMouseMove(e: MouseEvent) {
      const [mx, my] = canvasPos(e);
      if (dragging.current) {
        const [wx, wy] = transformRef.current.invert([mx, my]);
        dragging.current.fx = wx;
        dragging.current.fy = wy;
        simulation?.alphaTarget(0.0005).restart();
        return;
      }
      const found = nodeAt(simNodes, mx, my, transformRef.current);
      if (found !== hoveredRef.current) {
        hoveredRef.current = found;
        canvasEl!.style.cursor = found ? "pointer" : "default";
        setHovered(found);
        scheduleDraw();
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return;
      const [mx, my] = canvasPos(e);
      mouseDownPos.current = [mx, my];
      const found = nodeAt(simNodes, mx, my, transformRef.current);
      if (found) {
        dragging.current = found;
        found.fx = found.x ?? 0;
        found.fy = found.y ?? 0;
      }
    }

    function onMouseLeave() {
      if (dragging.current) return;
      if (hoveredRef.current) {
        hoveredRef.current = null;
        canvasEl!.style.cursor = "default";
        setHovered(null);
        scheduleDraw();
      }
    }

    function onMouseUp(e: MouseEvent) {
      const node = dragging.current;
      const downPos = mouseDownPos.current;
      dragging.current = null;
      mouseDownPos.current = null;

      if (node) {
        simulation?.alphaTarget(0);
        node.fx = null;
        node.fy = null;

        if (downPos) {
          const [mx, my] = canvasPos(e);
          const dx = mx - downPos[0];
          const dy = my - downPos[1];
          if (dx * dx + dy * dy < 25) setSelected(node);
        }
      }
    }

    function onWindowBlur() {
      if (dragging.current) {
        simulation?.alphaTarget(0);
        dragging.current.fx = null;
        dragging.current.fy = null;
        dragging.current = null;
        mouseDownPos.current = null;
      }
    }

    canvasEl.addEventListener("mousemove", onMouseMove);
    canvasEl.addEventListener("mousedown", onMouseDown);
    canvasEl.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("blur", onWindowBlur);

    // ── resize ──────────────────────────────────────────────────────
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        W = container.clientWidth;
        H = container.clientHeight;
        canvasEl.width = W * dpr;
        canvasEl.height = H * dpr;
        canvasEl.style.width = `${W}px`;
        canvasEl.style.height = `${H}px`;
        ctx.scale(dpr, dpr);
        scheduleDraw();
      }, 50);
    });
    ro.observe(container);

    // ── readiness gate: show only when BOTH positions + images ready ──
    let positionsReady = false;

    function tryShow() {
      if (positionsReady) {
        setLoading(false);
        draw();
      }
    }

    // ── init after worker returns positions ───────────────────────────
    function initWithPositions() {
      simNodes.forEach(n => nodeMap.set(n.id, n));
      simLinks.forEach(l => {
        const srcId = typeof l.source === "string" ? l.source : (l.source as ApiSimNode).id;
        const tgtId = typeof l.target === "string" ? l.target : (l.target as ApiSimNode).id;
        (l as unknown as Record<string, unknown>).source = nodeMap.get(srcId)!;
        (l as unknown as Record<string, unknown>).target = nodeMap.get(tgtId)!;
      });

      adjacency = buildAdjacency(simLinks);
      simulation = d3.forceSimulation<ApiSimNode>(simNodes)
        .force("collide", d3.forceCollide<ApiSimNode>().radius(d => nodeR(d.rankNorm) + 15).strength(0.85).iterations(3))
        .alpha(0).stop();
      simulation.on("tick", scheduleDraw);

      positionsReady = true;
      tryShow();
    }

    // ── avatar preload (parallel with worker) ────────────────────────
    const images = imagesRef.current;

    // Evict images for nodes no longer in the graph
    const currentIds = new Set(data.nodes.map(n => n.id));
    currentIds.add("__fallback__");
    images.forEach((_, id) => { if (!currentIds.has(id)) images.delete(id); });

    function onImageSettled() {
      scheduleDraw();
    }

    function startAvatarLoad() {
      data.nodes.forEach(node => {
        if (images.has(node.id)) return;
        const img = new Image();
        img.src = node.avatarUrl;
        img.onload = () => { images.set(node.id, img); onImageSettled(); };
        img.onerror = () => { images.set(node.id, images.get("__fallback__")!); onImageSettled(); };
      });
    }

    if (images.has("__fallback__")) {
      startAvatarLoad();
    } else {
      const fallback = new Image();
      fallback.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(FALLBACK_SVG)}`;
      fallback.onload = () => { images.set("__fallback__", fallback); startAvatarLoad(); };
    }

    // ── web worker simulation ────────────────────────────────────────
    const worker = new Worker(
      new URL("./simulation.worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = (e: MessageEvent<{ positions: Array<{ id: string; x: number; y: number }> }>) => {
      const posMap = new Map(e.data.positions.map(p => [p.id, p]));
      simNodes.forEach(n => {
        const pos = posMap.get(n.id);
        if (pos) { n.x = pos.x; n.y = pos.y; }
      });
      initWithPositions();
      worker.terminate();
    };

    worker.onerror = () => {
      const sorted = [...simNodes].sort((a, b) => (b.pageRank ?? 0) - (a.pageRank ?? 0));
      sorted.forEach((n, i) => { n.rankNorm = i / Math.max(sorted.length - 1, 1); });
      const fallbackSim = buildSimulation(simNodes, simLinks, W, H);
      while (fallbackSim.alpha() > fallbackSim.alphaMin()) fallbackSim.tick();
      fallbackSim.stop();
      initWithPositions();
    };

    worker.postMessage({ nodes: data.nodes, links: data.links, W, H });

    return () => {
      worker.terminate();
      simulation?.stop();
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      ro.disconnect();
      d3.select(canvasEl).on(".zoom", null);
      canvasEl.removeEventListener("mousemove", onMouseMove);
      canvasEl.removeEventListener("mousedown", onMouseDown);
      canvasEl.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, [data]);

  function setPanelHovered(node: ApiNode | null) {
    panelHoveredRef.current = node ? (nodeMapRef.current.get(node.id) ?? null) : null;
    scheduleDrawRef.current();
  }

  return { canvasRef, containerRef, hovered, selected, setSelected, setPanelHovered, loading };
}
