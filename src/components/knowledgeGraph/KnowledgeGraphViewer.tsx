// Interactive Knowledge Graph Visualizer for Applicant Entities & Relationships

import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  DollarSign,
  FileText,
  Filter,
  GraduationCap,
  Network,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  UserCheck,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import React, { useState } from 'react';
import { KGNode, KGNodeType, KnowledgeGraphData } from '../../types';

interface Props {
  graphData: KnowledgeGraphData;
  applicantName: string;
}

export const KnowledgeGraphViewer: React.FC<Props> = ({ graphData }) => {
  const [selectedNode, setSelectedNode] = useState<KGNode | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        <Network className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
        <h4 className="font-bold text-slate-800 dark:text-slate-200">Knowledge Graph Not Generated Yet</h4>
        <p className="text-xs text-slate-500 mt-1">Run Multi-Agent Analysis to construct semantic relationship nodes.</p>
      </div>
    );
  }

  // Node Color Mapping
  const getNodeColor = (type: KGNodeType) => {
    switch (type) {
      case 'STUDENT':
        return { bg: '#4f46e5', border: '#3730a3', text: '#ffffff', icon: GraduationCap };
      case 'SKILL':
        return { bg: '#0284c7', border: '#0369a1', text: '#ffffff', icon: Sparkles };
      case 'PROJECT':
        return { bg: '#7c3aed', border: '#6d28d9', text: '#ffffff', icon: Briefcase };
      case 'SUBJECT':
        return { bg: '#059669', border: '#047857', text: '#ffffff', icon: BookOpen };
      case 'CAREER_GOAL':
        return { bg: '#d97706', border: '#b45309', text: '#ffffff', icon: Target };
      case 'RESEARCH_INTEREST':
        return { bg: '#e11d48', border: '#be123c', text: '#ffffff', icon: Sparkles };
      case 'RECOMMENDER':
        return { bg: '#9333ea', border: '#7e22ce', text: '#ffffff', icon: UserCheck };
      case 'FINANCIAL_SPONSOR':
        return { bg: '#ca8a04', border: '#a16207', text: '#ffffff', icon: DollarSign };
      default:
        return { bg: '#64748b', border: '#475569', text: '#ffffff', icon: FileText };
    }
  };

  const filteredNodes = graphData.nodes.filter(node => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      (activeCategory === 'SKILL' && node.type === 'SKILL') ||
      (activeCategory === 'PROJECT' && node.type === 'PROJECT') ||
      (activeCategory === 'SUBJECT' && node.type === 'SUBJECT') ||
      (activeCategory === 'RESEARCH' && (node.type === 'RESEARCH_INTEREST' || node.type === 'CAREER_GOAL')) ||
      (activeCategory === 'RECOMMENDER' && node.type === 'RECOMMENDER') ||
      (activeCategory === 'FINANCIAL' && node.type === 'FINANCIAL_SPONSOR');

    const matchesSearch =
      !searchQuery ||
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.subLabel && node.subLabel.toLowerCase().includes(searchQuery.toLowerCase()));

    return node.type === 'STUDENT' || (matchesCategory && matchesSearch);
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graphData.edges.filter(
    e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {[
            { id: 'ALL', label: 'All Entities' },
            { id: 'SKILL', label: 'Skills' },
            { id: 'PROJECT', label: 'Projects' },
            { id: 'SUBJECT', label: 'Academic Subjects' },
            { id: 'RESEARCH', label: 'Research & Goals' },
            { id: 'RECOMMENDER', label: 'Recommenders' },
            { id: 'FINANCIAL', label: 'Financials' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search graph..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-36 sm:w-44"
            />
          </div>

          <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.0))}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPan({ x: 0, y: 0 });
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        className="relative w-full h-[540px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            {/* Arrow Marker */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
            </marker>
          </defs>

          {/* Render Edges */}
          {filteredEdges.map(edge => {
            const sourceNode = graphData.nodes.find(n => n.id === edge.source);
            const targetNode = graphData.nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

            const midX = (sourceNode.x! + targetNode.x!) / 2;
            const midY = (sourceNode.y! + targetNode.y!) / 2;

            return (
              <g key={edge.id} className="transition-opacity">
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#818cf8' : '#334155'}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={edge.relationship === 'SPONSORED_BY' ? '4 3' : undefined}
                  markerEnd="url(#arrow)"
                />
                {/* Edge Label Pill */}
                <rect
                  x={midX - 35}
                  y={midY - 9}
                  width="70"
                  height="18"
                  rx="9"
                  fill="#0f172a"
                  stroke={isHighlighted ? '#818cf8' : '#1e293b'}
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY + 3.5}
                  textAnchor="middle"
                  fill={isHighlighted ? '#c7d2fe' : '#64748b'}
                  fontSize="7.5"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {edge.relationship.replace(/_/g, ' ')}
                </text>
              </g>
            );
          })}

          {/* Render Nodes */}
          {filteredNodes.map(node => {
            const isCenter = node.type === 'STUDENT';
            const isSelected = selectedNode?.id === node.id;
            const color = getNodeColor(node.type);
            const r = isCenter ? 44 : 26;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                className="cursor-pointer group"
              >
                {/* Outer Glow Halo if Selected */}
                {isSelected && (
                  <circle
                    r={r + 8}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    className="animate-pulse"
                    opacity="0.8"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={r}
                  fill={color.bg}
                  stroke={isSelected ? '#ffffff' : color.border}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-transform group-hover:scale-110 drop-shadow-md"
                />

                {/* Node Label Text */}
                <text
                  textAnchor="middle"
                  dy={isCenter ? -6 : -2}
                  fill="#ffffff"
                  fontSize={isCenter ? '11' : '8.5'}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {node.label.length > 18 ? `${node.label.substring(0, 16)}...` : node.label}
                </text>

                {/* Sub-label text */}
                {node.subLabel && (
                  <text
                    textAnchor="middle"
                    dy={isCenter ? 12 : 9}
                    fill="#cbd5e1"
                    fontSize={isCenter ? '8.5' : '6.5'}
                    pointerEvents="none"
                  >
                    {node.subLabel.length > 22 ? `${node.subLabel.substring(0, 20)}...` : node.subLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute right-4 top-4 bottom-4 w-80 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl p-5 text-white flex flex-col justify-between animate-in slide-in-from-right-4 duration-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  {selectedNode.type.replace(/_/g, ' ')}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h4 className="font-bold text-base text-white">{selectedNode.label}</h4>
              {selectedNode.subLabel && (
                <p className="text-xs text-slate-300 mt-1 font-mono">{selectedNode.subLabel}</p>
              )}

              <div className="mt-4 space-y-3 text-xs">
                {selectedNode.category && (
                  <div>
                    <span className="text-slate-400 text-[11px] block">Entity Category:</span>
                    <span className="font-semibold text-slate-200">{selectedNode.category}</span>
                  </div>
                )}

                {selectedNode.verifiedInDoc && (
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Document Grounding Source
                    </span>
                    <p className="text-slate-200 font-medium text-xs flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{selectedNode.verifiedInDoc}</span>
                    </p>
                  </div>
                )}

                {selectedNode.confidence && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Entity Confidence:</span>
                      <span className="font-bold text-emerald-400">{selectedNode.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${selectedNode.confidence}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <p className="text-[10px] text-slate-400 italic">
                Cross-referenced by Multi-Agent Reasoning Engine during holistic dossier evaluation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
