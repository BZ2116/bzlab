import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as echarts from 'echarts';

const StarMap = ({ projects, onProjectSelect }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Generate background stars
  const stars = useMemo(
    () =>
      [...Array(80)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.4,
        delay: Math.random() * 6,
        duration: 2 + Math.random() * 4,
      })),
    []
  );

  useEffect(() => {
    if (!chartRef.current || !containerRef.current) return;

    const chart = echarts.init(chartRef.current);
    const container = containerRef.current;

    const isSmall = container.clientWidth < 500;
    const baseSize = isSmall ? 25 : 50;
    const sizeMultiplier = isSmall ? 12 : 25;

    const nodes = projects.map((p) => {
      const isResearch = p.type === 'research';
      return {
        name: p.name,
        id: p.id,
        symbolSize: baseSize + p.size * sizeMultiplier,
        symbol: isResearch ? 'circle' : 'diamond',
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: isResearch ? '#00d4ff' : '#7b61ff' },
              { offset: 0.6, color: isResearch ? '#0088aa' : '#5533cc' },
              { offset: 1, color: 'rgba(0,0,0,0)' },
            ],
          },
          borderColor: isResearch ? '#00d4ff' : '#7b61ff',
          borderWidth: 2,
          shadowBlur: 25,
          shadowColor: isResearch ? 'rgba(0,212,255,0.6)' : 'rgba(123,97,255,0.6)',
        },
        label: {
          show: true,
          formatter: [
            `{title|${p.name}}`,
            `{sub|${p.type === 'research' ? 'Research' : 'Application'}}`,
          ].join('\n'),
          rich: {
            title: {
              color: '#e8f0f8',
              fontSize: isSmall ? 10 : 13,
              fontWeight: 'bold',
              fontFamily: 'Orbitron',
              lineHeight: isSmall ? 15 : 20,
            },
            sub: {
              color: isResearch ? '#00d4ff' : '#7b61ff',
              fontSize: isSmall ? 8 : 10,
              fontFamily: 'JetBrains Mono',
              lineHeight: isSmall ? 12 : 16,
            },
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 40,
            borderWidth: 3,
          },
          label: {
            show: true,
          },
        },
      };
    });

    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].name,
        target: nodes[i + 1].name,
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: 'rgba(0,212,255,0.25)' },
              { offset: 0.5, color: 'rgba(123,97,255,0.15)' },
              { offset: 1, color: 'rgba(0,212,255,0.25)' },
            ],
          },
          width: 1.5,
          type: 'dashed',
          curveness: 0.3,
        },
      });
    }

    // Add some cross-connections for visual richness
    if (nodes.length >= 4) {
      edges.push({
        source: nodes[0].name,
        target: nodes[3].name,
        lineStyle: {
          color: 'rgba(0,255,136,0.1)',
          width: 1,
          type: 'dotted',
          curveness: 0.5,
        },
      });
      edges.push({
        source: nodes[1].name,
        target: nodes[4].name,
        lineStyle: {
          color: 'rgba(0,255,136,0.1)',
          width: 1,
          type: 'dotted',
          curveness: -0.4,
        },
      });
    }

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(13,21,32,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: [12, 16],
        textStyle: {
          color: '#e8f0f8',
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
        },
        formatter: (params) => {
          if (params.dataType === 'node') {
            const p = projects.find((pr) => pr.name === params.name);
            if (!p) return params.name;
            return `<div style="font-family:Orbitron;font-size:14px;color:#00d4ff;margin-bottom:4px">${p.name}</div>
                    <div style="color:#6b7f94;font-size:11px;margin-bottom:6px">${p.fullName}</div>
                    <div style="font-size:11px">${p.description.slice(0, 60)}...</div>`;
          }
          return '';
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: nodes,
          links: edges,
          roam: true,
          draggable: true,
          force: {
            repulsion: isSmall ? 150 : 350,
            gravity: 0.08,
            edgeLength: isSmall ? [60, 150] : [120, 280],
            friction: 0.6,
            layoutAnimation: true,
          },
          emphasis: {
            focus: 'adjacency',
            blurScope: 'global',
          },
          lineStyle: {
            curveness: 0.2,
          },
          cursor: 'pointer',
        },
      ],
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(container);

    chart.on('click', (params) => {
      if (params.dataType === 'node') {
        const project = projects.find((p) => p.name === params.name);
        if (project) onProjectSelect(project);
      }
    });

    chart.on('mouseover', (params) => {
      if (params.dataType === 'node') {
        const p = projects.find((pr) => pr.name === params.name);
        setHoveredProject(p || null);
      }
    });

    chart.on('mouseout', () => {
      setHoveredProject(null);
    });

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [projects, onProjectSelect]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ECharts container */}
      <div ref={chartRef} className="w-full h-full min-h-[300px] sm:min-h-[400px]" />

      {/* Title overlay */}
      <div className="absolute top-3 left-3 sm:top-5 sm:left-6 pointer-events-none">
        <div className="font-['Orbitron'] text-[#e8f0f8] text-sm sm:text-lg tracking-wider">
          STAR MAP
        </div>
        <div className="text-[10px] sm:text-xs font-['JetBrains_Mono'] text-[#6b7f94] mt-1">
          {projects.length} projects · {isMobile ? 'tap' : 'click'} to explore
        </div>
      </div>

      {/* Hovered project info - hidden on mobile */}
      {hoveredProject && !isMobile && (
        <div className="absolute top-5 right-6 max-w-[240px] pointer-events-none animate-fadeIn hidden sm:block">
          <div className="bg-[#0d1520]/90 backdrop-blur-md rounded-lg border border-white/[0.08] p-3">
            <div className="font-['Orbitron'] text-sm text-[#00d4ff]">
              {hoveredProject.name}
            </div>
            <div className="text-xs text-[#6b7f94] font-['JetBrains_Mono'] mt-1 line-clamp-2">
              {hoveredProject.description}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {hoveredProject.tech.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-[#131f30] text-[#6b7f94]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-6 flex gap-3 sm:gap-5 text-[10px] sm:text-xs font-['JetBrains_Mono']">
        <span className="flex items-center gap-1.5 sm:gap-2 text-[#6b7f94]">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0088aa] shadow-[0_0_8px_rgba(0,212,255,0.5)]"></span>
          Research
        </span>
        <span className="flex items-center gap-1.5 sm:gap-2 text-[#6b7f94]">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 bg-gradient-to-br from-[#7b61ff] to-[#5533cc] shadow-[0_0_8px_rgba(123,97,255,0.5)]"></span>
          App
        </span>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-6 text-[10px] sm:text-xs font-['JetBrains_Mono'] text-[#6b7f94]/60">
        {isMobile ? 'pinch to zoom' : 'drag to move · scroll to zoom'}
      </div>
    </div>
  );
};

export default StarMap;
