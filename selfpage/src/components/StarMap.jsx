import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const StarMap = ({ projects, onProjectSelect, selectedProject }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    if (!chartRef.current || !containerRef.current) return;

    const chart = echarts.init(chartRef.current);
    let resizeObserver;

    const initChart = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width === 0 || height === 0) return;

      const nodes = projects.map((p) => ({
        name: p.name,
        id: p.id,
        value: [Math.random() * 100, Math.random() * 70],
        symbolSize: 40 + p.size * 20,
        itemStyle: {
          color: p.type === 'research' ? '#00d4ff' : '#7b61ff',
          borderColor: p.type === 'research' ? '#00d4ff' : '#7b61ff',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: p.type === 'research' ? 'rgba(0,212,255,0.5)' : 'rgba(123,97,255,0.5)',
        },
        label: {
          show: true,
          formatter: p.name,
          color: '#e8f0f8',
          fontSize: 12,
          fontFamily: 'JetBrains Mono',
        },
      }));

      const edges = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({
          source: nodes[i].name,
          target: nodes[i + 1].name,
          lineStyle: {
            color: 'rgba(0,212,255,0.15)',
            width: 1,
            type: 'dashed',
          },
        });
      }

      const option = {
        backgroundColor: 'transparent',
        grid: { show: false },
        xAxis: { show: false, type: 'value', min: 0, max: 100 },
        yAxis: { show: false, type: 'value', min: 0, max: 80 },
        series: [
          {
            type: 'graph',
            layout: 'none',
            data: nodes,
            links: edges,
            roam: true,
            emphasis: {
              focus: 'adjacency',
              itemStyle: {
                borderWidth: 4,
                shadowBlur: 40,
              },
              lineStyle: { width: 3 },
            },
            lineStyle: {
              curveness: 0.2,
            },
            cursor: 'pointer',
          },
        ],
      };

      chart.setOption(option);
    };

    initChart();

    resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(containerRef.current);

    chart.on('click', (params) => {
      const project = projects.find((p) => p.name === params.name);
      if (project) onProjectSelect(project);
    });

    chart.on('mouseover', (params) => {
      setHoveredNode(params.name);
    });

    chart.on('mouseout', () => {
      setHoveredNode(null);
    });

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      chart.dispose();
    };
  }, [projects, onProjectSelect]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div ref={chartRef} className="w-full h-full min-h-[400px]" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-xs font-['JetBrains_Mono'] text-[#6b7f94]">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00d4ff]"></span>
          研究项目
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#7b61ff]"></span>
          应用项目
        </span>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 text-xs font-['JetBrains_Mono'] text-[#6b7f94]">
        点击节点查看详情 / 拖拽移动
      </div>
    </div>
  );
};

export default StarMap;