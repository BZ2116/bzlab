import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const StarMap = ({ projects, onProjectSelect }) => {
  const chartRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    if (!chartRef.current || !containerRef.current) return;

    const chart = echarts.init(chartRef.current);
    const container = containerRef.current;

    const buildOption = () => {
      const nodes = projects.map((p) => ({
        name: p.name,
        id: p.id,
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

      return {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: edges,
            roam: true,
            draggable: true,
            force: {
              repulsion: 300,
              gravity: 0.1,
              edgeLength: [100, 250],
              friction: 0.6,
              layoutAnimation: true,
            },
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
    };

    chart.setOption(buildOption());

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(container);

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
      resizeObserver.disconnect();
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
