import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';

/* ───── Constellation node positions (virtual space) ───── */
const NODE_POSITIONS = [
  { x: 0, y: -120 },      // top
  { x: 160, y: -30 },     // top-right
  { x: 100, y: 120 },     // bottom-right
  { x: -100, y: 120 },    // bottom-left
  { x: -160, y: -30 },    // top-left
];

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], // outer ring
  [0, 2], [1, 4],                           // cross lines
];

const StarMap = ({ projects, onProjectSelect }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);

  // Camera
  const cameraRef = useRef({ x: 0, y: 0, zoom: 1 });

  // Mouse / touch
  const mouseRef = useRef({ x: 0, y: 0, canvasX: 0, canvasY: 0 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, camStartX: 0, camStartY: 0 });
  const pinchRef = useRef({ dist: 0, zoom: 1 });

  // Hover state (React — for the overlay panel)
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const hoveredRef = useRef(null);

  // Generate background data once
  const stars = useMemo(() =>
    [...Array(250)].map(() => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      r: 0.3 + Math.random() * 1.5,
      brightness: 0.2 + Math.random() * 0.6,
      twinkleSpeed: 0.5 + Math.random() * 2,
      twinkleOffset: Math.random() * Math.PI * 2,
    })), []);

  const nebulae = useMemo(() => [
    { x: -300, y: -200, r: 250, color: 'rgba(0,212,255,0.04)' },
    { x: 250, y: 150, r: 300, color: 'rgba(123,97,255,0.035)' },
    { x: -100, y: 250, r: 200, color: 'rgba(0,255,136,0.025)' },
    { x: 350, y: -150, r: 180, color: 'rgba(255,100,200,0.02)' },
  ], []);

  // Flowing particles along connections
  const flowParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < CONNECTIONS.length; i++) {
      for (let j = 0; j < 3; j++) {
        particles.push({
          connection: i,
          t: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
          size: 1 + Math.random() * 1.5,
        });
      }
    }
    return particles;
  }, []);

  // Project node data with fixed positions
  const nodes = useMemo(() =>
    projects.map((p, i) => ({
      ...p,
      x: NODE_POSITIONS[i]?.x ?? (Math.random() - 0.5) * 200,
      y: NODE_POSITIONS[i]?.y ?? (Math.random() - 0.5) * 200,
      baseRadius: 18 + (p.size || 1) * 10,
      isResearch: p.type === 'research',
    })), [projects]);

  /* ───── Coordinate transforms ───── */
  const worldToScreen = useCallback((wx, wy) => {
    const cam = cameraRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return {
      x: (wx - cam.x) * cam.zoom + cx,
      y: (wy - cam.y) * cam.zoom + cy,
    };
  }, []);

  const screenToWorld = useCallback((sx, sy) => {
    const cam = cameraRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return {
      x: (sx - cx) / cam.zoom + cam.x,
      y: (sy - cy) / cam.zoom + cam.y,
    };
  }, []);

  /* ───── Main render loop ───── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const draw = () => {
      time += 1 / 60;
      const cam = cameraRef.current;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const mx = mouseRef.current.canvasX;
      const my = mouseRef.current.canvasY;

      // Clear
      ctx.fillStyle = '#060810';
      ctx.fillRect(0, 0, w, h);

      // Parallax offset based on mouse
      const parallaxX = (mx - w / 2) * 0.02;
      const parallaxY = (my - h / 2) * 0.02;

      // ── Nebulae (background layer) ──
      nebulae.forEach(n => {
        const s = worldToScreen(n.x + parallaxX * 0.3, n.y + parallaxY * 0.3);
        const r = n.r * cam.zoom;
        if (s.x + r < 0 || s.x - r > w || s.y + r < 0 || s.y - r > h) return;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2);
      });

      // ── Stars ──
      stars.forEach(star => {
        const s = worldToScreen(star.x + parallaxX * 0.5, star.y + parallaxY * 0.5);
        if (s.x < -5 || s.x > w + 5 || s.y < -5 || s.y > h + 5) return;
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.brightness * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, star.r * cam.zoom, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${alpha})`;
        ctx.fill();
      });

      // ── Connection lines ──
      CONNECTIONS.forEach(([a, b], ci) => {
        const na = nodes[a];
        const nb = nodes[b];
        if (!na || !nb) return;
        const sa = worldToScreen(na.x, na.y);
        const sb = worldToScreen(nb.x, nb.y);

        ctx.beginPath();
        ctx.moveTo(sa.x, sa.y);
        ctx.lineTo(sb.x, sb.y);
        ctx.strokeStyle = 'rgba(0,212,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // ── Flowing particles on connections ──
      flowParticles.forEach(fp => {
        const [ai, bi] = CONNECTIONS[fp.connection];
        const na = nodes[ai];
        const nb = nodes[bi];
        if (!na || !nb) return;

        fp.t += fp.speed;
        if (fp.t > 1) fp.t -= 1;

        const wx = na.x + (nb.x - na.x) * fp.t;
        const wy = na.y + (nb.y - na.y) * fp.t;
        const s = worldToScreen(wx, wy);
        if (s.x < -10 || s.x > w + 10 || s.y < -10 || s.y > h + 10) return;

        const alpha = Math.sin(fp.t * Math.PI) * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, fp.size * cam.zoom, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${alpha})`;
        ctx.fill();
      });

      // ── Project orbs ──
      const hovered = hoveredRef.current;
      nodes.forEach((node) => {
        const s = worldToScreen(node.x, node.y);
        const r = node.baseRadius * cam.zoom;
        const isHovered = hovered && hovered.id === node.id;
        const displayR = isHovered ? r * 1.3 : r;
        const baseColor = node.isResearch ? [0, 212, 255] : [123, 97, 255];
        const [cr, cg, cb] = baseColor;

        // Pulse ring (hovered)
        if (isHovered) {
          const pulseR = displayR * (1.3 + 0.2 * Math.sin(time * 4));
          ctx.beginPath();
          ctx.arc(s.x, s.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.3 - 0.15 * Math.sin(time * 4)})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Second ring
          const pulseR2 = displayR * (1.6 + 0.3 * Math.sin(time * 3));
          ctx.beginPath();
          ctx.arc(s.x, s.y, pulseR2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.1)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Outer glow
        const glowGrad = ctx.createRadialGradient(s.x, s.y, displayR * 0.5, s.x, s.y, displayR * 2.5);
        glowGrad.addColorStop(0, `rgba(${cr},${cg},${cb},${isHovered ? 0.2 : 0.1})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, displayR * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core orb
        const coreGrad = ctx.createRadialGradient(s.x - displayR * 0.2, s.y - displayR * 0.2, 0, s.x, s.y, displayR);
        coreGrad.addColorStop(0, `rgba(${Math.min(cr + 100, 255)},${Math.min(cg + 100, 255)},${Math.min(cb + 100, 255)},0.95)`);
        coreGrad.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.8)`);
        coreGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0.1)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, displayR, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Border
        ctx.beginPath();
        ctx.arc(s.x, s.y, displayR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${isHovered ? 0.8 : 0.4})`;
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = `${isHovered ? 'bold ' : ''}${11 * Math.max(cam.zoom, 0.6)}px "Orbitron", sans-serif`;
        ctx.fillStyle = `rgba(232,240,248,${isHovered ? 1 : 0.7})`;
        ctx.fillText(node.name, s.x, s.y + displayR + 8);

        // Sub label
        if (cam.zoom > 0.7) {
          ctx.font = `${9 * Math.max(cam.zoom, 0.5)}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(${cr},${cg},${cb},0.5)`;
          ctx.fillText(node.isResearch ? 'Research' : 'Application', s.x, s.y + displayR + 22);
        }
      });

      // ── Cursor glow ──
      if (mx > 0 && my > 0) {
        const cursorGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
        cursorGrad.addColorStop(0, 'rgba(0,212,255,0.06)');
        cursorGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = cursorGrad;
        ctx.beginPath();
        ctx.arc(mx, my, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
    };
  }, [nodes, stars, nebulae, flowParticles, worldToScreen]);

  /* ───── Hit test ───── */
  const hitTest = useCallback((sx, sy) => {
    const world = screenToWorld(sx, sy);
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = world.x - n.x;
      const dy = world.y - n.y;
      if (dx * dx + dy * dy < (n.baseRadius + 10) * (n.baseRadius + 10)) {
        return n;
      }
    }
    return null;
  }, [nodes, screenToWorld]);

  /* ───── Mouse events ───── */
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current = { x: e.clientX, y: e.clientY, canvasX: x, canvasY: y };

    if (dragRef.current.active) {
      const cam = cameraRef.current;
      cam.x = dragRef.current.camStartX - (e.clientX - dragRef.current.startX) / cam.zoom;
      cam.y = dragRef.current.camStartY - (e.clientY - dragRef.current.startY) / cam.zoom;
      return;
    }

    const hit = hitTest(x, y);
    if (hit) {
      hoveredRef.current = hit;
      setHoveredProject(hit);
      setHoverPos({ x: e.clientX, y: e.clientY });
      canvasRef.current.style.cursor = 'pointer';
    } else {
      hoveredRef.current = null;
      setHoveredProject(null);
      canvasRef.current.style.cursor = 'grab';
    }
  }, [hitTest]);

  const handleMouseDown = useCallback((e) => {
    if (hoveredRef.current) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      camStartX: cameraRef.current.x,
      camStartY: cameraRef.current.y,
    };
    canvasRef.current.style.cursor = 'grabbing';
  }, []);

  const handleMouseUp = useCallback((e) => {
    const wasDrag = dragRef.current.active &&
      (Math.abs(e.clientX - dragRef.current.startX) > 5 || Math.abs(e.clientY - dragRef.current.startY) > 5);
    dragRef.current.active = false;
    canvasRef.current.style.cursor = hoveredRef.current ? 'pointer' : 'grab';

    // Only trigger click if not dragged
    if (!wasDrag && hoveredRef.current) {
      onProjectSelect(hoveredRef.current);
    }
  }, [onProjectSelect]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const cam = cameraRef.current;
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    const newZoom = Math.max(0.3, Math.min(3, cam.zoom * factor));

    // Zoom toward mouse position
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const worldX = (mx - w / 2) / cam.zoom + cam.x;
    const worldY = (my - h / 2) / cam.zoom + cam.y;

    cam.x = worldX - (mx - w / 2) / newZoom;
    cam.y = worldY - (my - h / 2) / newZoom;
    cam.zoom = newZoom;
  }, []);

  /* ───── Touch events ───── */
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;
      mouseRef.current = { x: t.clientX, y: t.clientY, canvasX: x, canvasY: y };

      const hit = hitTest(x, y);
      if (hit) {
        hoveredRef.current = hit;
        setHoveredProject(hit);
        setHoverPos({ x: t.clientX, y: t.clientY });
      } else {
        hoveredRef.current = null;
        setHoveredProject(null);
        dragRef.current = {
          active: true,
          startX: t.clientX,
          startY: t.clientY,
          camStartX: cameraRef.current.x,
          camStartY: cameraRef.current.y,
        };
      }
    } else if (e.touches.length === 2) {
      dragRef.current.active = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = { dist: Math.sqrt(dx * dx + dy * dy), zoom: cameraRef.current.zoom };
    }
  }, [hitTest]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragRef.current.active) {
      const t = e.touches[0];
      const cam = cameraRef.current;
      cam.x = dragRef.current.camStartX - (t.clientX - dragRef.current.startX) / cam.zoom;
      cam.y = dragRef.current.camStartY - (t.clientY - dragRef.current.startY) / cam.zoom;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      cameraRef.current.zoom = Math.max(0.3, Math.min(3, pinchRef.current.zoom * (dist / pinchRef.current.dist)));
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const wasDrag = dragRef.current.active &&
      e.changedTouches[0] &&
      (Math.abs(e.changedTouches[0].clientX - dragRef.current.startX) > 10 ||
       Math.abs(e.changedTouches[0].clientY - dragRef.current.startY) > 10);
    dragRef.current.active = false;

    if (!wasDrag && hoveredRef.current) {
      onProjectSelect(hoveredRef.current);
      hoveredRef.current = null;
      setHoveredProject(null);
    }
  }, [onProjectSelect]);

  /* ───── Render ───── */
  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          dragRef.current.active = false;
          hoveredRef.current = null;
          setHoveredProject(null);
        }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Title overlay */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-6 pointer-events-none">
        <div className="font-['Orbitron'] text-[#e8f0f8] text-sm sm:text-lg tracking-wider">
          STAR MAP
        </div>
        <div className="text-[10px] sm:text-xs font-['JetBrains_Mono'] text-[#6b7f94] mt-1">
          {projects.length} projects · drag to explore
        </div>
      </div>

      {/* Hovered project info panel */}
      {hoveredProject && (
        <div
          className="fixed z-50 pointer-events-none animate-fadeIn"
          style={{
            left: hoverPos.x + 20,
            top: hoverPos.y - 20,
            maxWidth: 260,
          }}
        >
          <div className="bg-[#0d1520]/95 backdrop-blur-md rounded-lg border border-white/[0.1] p-3 shadow-xl">
            <div className="font-['Orbitron'] text-sm text-[#00d4ff] mb-1">
              {hoveredProject.name}
            </div>
            <div className="text-[11px] text-[#94a3b8] font-['JetBrains_Mono'] mb-2">
              {hoveredProject.fullName}
            </div>
            <div className="text-xs text-[#6b7f94] line-clamp-2 mb-2">
              {hoveredProject.description}
            </div>
            <div className="flex flex-wrap gap-1">
              {hoveredProject.tech.slice(0, 4).map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#131f30] text-[#6b7f94]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-6 flex gap-4 text-[10px] sm:text-xs font-['JetBrains_Mono'] pointer-events-none">
        <span className="flex items-center gap-1.5 text-[#6b7f94]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.5)]"></span>
          Research
        </span>
        <span className="flex items-center gap-1.5 text-[#6b7f94]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7b61ff] shadow-[0_0_8px_rgba(123,97,255,0.5)]"></span>
          Application
        </span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 text-[10px] sm:text-xs font-['JetBrains_Mono'] text-[#6b7f94]/50 pointer-events-none">
        drag · scroll to zoom · click node
      </div>
    </div>
  );
};

export default StarMap;
