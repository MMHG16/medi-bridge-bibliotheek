import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Library, Clock, AlignCenter, Sparkles, Share2, Eye, Zap,
  FileText, Copy, Inbox, Trash2, ChevronDown, ArrowUpDown,
  ArrowUp, ArrowDown, ExternalLink, Download, Bookmark,
  ChevronFirst, ChevronLeft, ChevronRight, ChevronLast,
} from 'lucide-react';
import { papers, collections, tagCounts } from '../data/papers';
import { getTagColor } from '../data/tags';
import type { Paper } from '../data/papers';

type SortField = 'title' | 'creators' | 'year';
type SortDirection = 'asc' | 'desc';
type CollectionId = string;

const iconMap: Record<string, React.ReactNode> = {
  Library: <Library size={16} />, Clock: <Clock size={16} />,
  AlignCenter: <AlignCenter size={16} />, Sparkles: <Sparkles size={16} />,
  Share2: <Share2 size={16} />, Eye: <Eye size={16} />,
  Zap: <Zap size={16} />, FileText: <FileText size={16} />,
  Copy: <Copy size={16} />, Inbox: <Inbox size={16} />,
  Trash2: <Trash2 size={16} />,
};

const ITEMS_PER_PAGE = 25;
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Bibliotheek() {
  const [selectedCollection, setSelectedCollection] = useState<CollectionId>('all');
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const [selectedPaperIds, setSelectedPaperIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilters, setActiveTagFilters] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const collectionFilteredPapers = useMemo(() => {
    if (selectedCollection === 'all' || selectedCollection === 'recent') return papers;
    const collectionMap: Record<string, string> = {
      'llm-alignment': 'LLM Alignment',
      'diffusion-and-generative-models': 'Diffusion & Generative Models',
      'graph-neural-networks': 'Graph Neural Networks',
      'multimodal-learning': 'Multimodal Learning',
      'efficient-inference-and-quantization': 'Efficient Inference & Quantization',
    };
    const collectionName = collectionMap[selectedCollection];
    if (!collectionName) return papers;
    return papers.filter((p) => p.collection === collectionName);
  }, [selectedCollection]);

  const filteredPapers = useMemo(() => {
    let result = collectionFilteredPapers;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.creators.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTagFilters.size > 0) {
      result = result.filter((p) =>
        Array.from(activeTagFilters).every((tag) => p.tags.includes(tag))
      );
    }
    return result;
  }, [collectionFilteredPapers, searchQuery, activeTagFilters]);

  const sortedPapers = useMemo(() => {
    const sorted = [...filteredPapers];
    sorted.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortField === 'creators') cmp = a.creators.localeCompare(b.creators);
      else if (sortField === 'year') cmp = a.year - b.year;
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [filteredPapers, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedPapers.length / ITEMS_PER_PAGE));
  const paginatedPapers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedPapers.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedPapers, currentPage]);

  const selectedPaper = useMemo(() => papers.find((p) => p.id === selectedPaperId) || null, [selectedPaperId]);

  useEffect(() => { setCurrentPage(1); }, [selectedCollection, searchQuery, activeTagFilters, sortField, sortDirection]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  }, [sortField]);

  const toggleTagFilter = useCallback((tag: string) => {
    setActiveTagFilters((prev) => { const next = new Set(prev); if (next.has(tag)) next.delete(tag); else next.add(tag); return next; });
  }, []);

  const clearTagFilters = useCallback(() => { setActiveTagFilters(new Set()); }, []);

  const handleRowClick = useCallback((paper: Paper, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedPaperIds((prev) => { const next = new Set(prev); if (next.has(paper.id)) next.delete(paper.id); else next.add(paper.id); return next; });
      setSelectedPaperId(paper.id);
    } else { setSelectedPaperId(paper.id); setSelectedPaperIds(new Set([paper.id])); }
  }, []);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} style={{ color: '#8a827a' }} />;
    return sortDirection === 'asc' ? <ArrowUp size={14} style={{ color: '#3d8c87' }} /> : <ArrowDown size={14} style={{ color: '#3d8c87' }} />;
  };

  const sortedTags = useMemo(() => Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag]) => tag), []);

  return (
    <div className="flex flex-1 overflow-hidden">
      <motion.aside initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, ease: easeOutExpo, delay: 0.1 }} className="w-[240px] shrink-0 flex flex-col overflow-y-auto border-r" style={{ backgroundColor: '#faf8f5', borderColor: '#e5e1dc' }}>
        <div className="py-4">
          <h2 className="px-4 pb-2 text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: '#8a827a', fontFamily: "'DM Sans', system-ui, sans-serif" }}>Collecties</h2>
          <nav className="flex flex-col">
            {collections.map((col, idx) => {
              if (col.id === 'separator') return <div key={col.id + idx} className="mx-4 my-2 border-t" style={{ borderColor: '#eeeae5' }} />;
              const isActive = selectedCollection === col.id;
              return (
                <motion.button key={col.id} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.2, ease: easeOutExpo, delay: 0.1 + idx * 0.03 }} onClick={() => setSelectedCollection(col.id)}
                  className="flex items-center gap-2.5 h-[38px] px-4 text-[14px] font-medium transition-colors duration-150 relative"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: isActive ? '#3d8c87' : '#5a5550', backgroundColor: isActive ? '#e8f3f2' : 'transparent', borderLeft: isActive ? '3px solid #3d8c87' : '3px solid transparent' }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f4f1ed'; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}>
                  <span style={{ color: isActive ? '#3d8c87' : '#8a827a' }}>{iconMap[col.icon] || <Library size={16} />}</span>
                  <span className="flex-1 text-left truncate">{col.name}</span>
                  {col.count > 0 && <span className="text-[12px] tabular-nums" style={{ color: '#8a827a', fontFamily: "'Source Code Pro', monospace" }}>{col.count}</span>}
                </motion.button>
              );
            })}
          </nav>
        </div>
        <div className="border-t" style={{ borderColor: '#eeeae5' }}>
          <button onClick={() => setTagsExpanded(!tagsExpanded)} className="flex items-center justify-between w-full px-4 py-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: '#8a827a', fontFamily: "'DM Sans', system-ui, sans-serif" }}>Tags Filteren</h2>
            <motion.div animate={{ rotate: tagsExpanded ? 180 : 0 }} transition={{ duration: 0.25, ease: easeOutExpo }}><ChevronDown size={14} style={{ color: '#8a827a' }} /></motion.div>
          </button>
          <AnimatePresence>
            {tagsExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: easeOutExpo }} className="overflow-hidden">
                <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                  {sortedTags.slice(0, 200).map((tag) => {
                    const isActive = activeTagFilters.has(tag);
                    const tagColor = getTagColor(tag);
                    const count = tagCounts[tag] || 0;
                    return (
                      <button key={tag} onClick={() => toggleTagFilter(tag)} className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-[14px] transition-all duration-150"
                        style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: isActive ? tagColor.bgHex : tagColor.bgHex + 'b3', color: tagColor.hex, border: isActive ? `1px solid ${tagColor.hex}` : '1px solid transparent', opacity: isActive ? 1 : 0.85, transform: isActive ? 'scale(1.02)' : 'scale(1)' }}
                        title={`${tag}: ${count} items`}>{tag}<span style={{ opacity: 0.6, fontSize: '10px' }}>({count})</span></button>
                    );
                  })}
                </div>
                {activeTagFilters.size > 0 && (
                  <div className="px-4 pb-3"><button onClick={clearTagFilters} className="text-[12px] font-medium transition-colors hover:underline" style={{ color: '#3d8c87' }}>Alle tags wissen</button></div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#faf8f5' }}>
        <div className="flex items-center h-[44px] shrink-0 border-b" style={{ backgroundColor: '#f4f1ed', borderColor: '#e5e1dc' }}>
          {([['title', 'Titel', '55%'], ['creators', 'Auteur(s)', '30%'], ['year', 'Jaar', '15%']] as [SortField, string, string][]).map(([field, label, width]) => (
            <button key={field} onClick={() => handleSort(field)} className="flex items-center gap-1.5 px-4 h-full transition-colors duration-150 hover:bg-[#eeeae5]" style={{ width }}>
              <span className="text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: '#8a827a', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{label}</span>{getSortIcon(field)}
            </button>
          ))}
        </div>
        <div ref={tableRef} className="flex-1 overflow-y-auto custom-scrollbar" style={{ backgroundColor: '#faf8f5' }}>
          {paginatedPapers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <img src="/empty-state-illustration.svg" alt="Geen resultaten" className="w-[200px] h-[160px]" />
              <div className="text-center">
                <h3 className="text-[16px] font-normal" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Geen resultaten gevonden</h3>
                <p className="text-[13px] mt-1" style={{ color: '#5a5550' }}>Pas je zoekopdracht of filters aan om publicaties te vinden.</p>
              </div>
              {(searchQuery || activeTagFilters.size > 0) && (
                <button onClick={() => { setSearchQuery(''); clearTagFilters(); }} className="px-4 py-2 text-[13px] font-medium rounded-[10px] border transition-colors duration-200" style={{ backgroundColor: '#faf8f5', color: '#3d8c87', borderColor: '#3d8c87' }}>Filters wissen</button>
              )}
            </div>
          ) : (
            <>
              {paginatedPapers.map((paper, idx) => {
                const isSelected = selectedPaperId === paper.id;
                const isMultiSelected = selectedPaperIds.has(paper.id);
                const isHovered = hoveredRowId === paper.id;
                const visibleTags = paper.tags.slice(0, 3);
                const extraTagCount = paper.tags.length - 3;
                return (
                  <motion.div key={paper.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: easeOutExpo, delay: Math.min(idx * 0.02, 0.3) }}
                    onClick={(e) => handleRowClick(paper, e)} onMouseEnter={() => setHoveredRowId(paper.id)} onMouseLeave={() => setHoveredRowId(null)} onDoubleClick={() => { if (paper.url) window.open(paper.url, '_blank'); }}
                    className="flex items-center h-[52px] border-b cursor-pointer transition-colors duration-150 relative"
                    style={{ borderColor: '#eeeae5', backgroundColor: isSelected || isMultiSelected ? '#e8f3f2' : 'transparent', borderLeft: isSelected || isMultiSelected ? '3px solid #3d8c87' : '3px solid transparent' }}>
                    <div className="px-4 overflow-hidden" style={{ width: '55%' }}>
                      <div className="text-[14px] font-medium truncate" title={paper.title} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1c1917' }}>{paper.title}</div>
                      {(isHovered || isSelected || isMultiSelected) && paper.tags.length > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="flex items-center gap-1 mt-0.5">
                          {visibleTags.map((tag) => { const tc = getTagColor(tag); return <span key={tag} className="inline-block px-1.5 py-0 text-[10px] font-medium rounded-[10px]" style={{ backgroundColor: tc.bgHex + '99', color: tc.hex }}>{tag}</span>; })}
                          {extraTagCount > 0 && <span className="text-[10px]" style={{ color: '#8a827a' }}>+{extraTagCount}</span>}
                        </motion.div>
                      )}
                    </div>
                    <div className="px-4 overflow-hidden" style={{ width: '30%' }}><div className="text-[13px] truncate" title={paper.creators} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#5a5550' }}>{paper.creators.length > 60 ? paper.creators.substring(0, 60) + '...' : paper.creators}</div></div>
                    <div className="px-4 text-right overflow-hidden" style={{ width: '15%' }}><span className="text-[13px] tabular-nums" style={{ fontFamily: "'Source Code Pro', monospace", color: '#5a5550' }}>{paper.year}</span></div>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>
        <div className="flex items-center justify-between h-[48px] shrink-0 px-4 border-t" style={{ backgroundColor: '#faf8f5', borderColor: '#e5e1dc' }}>
          <span className="text-[13px]" style={{ color: '#5a5550' }}>Toont {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedPapers.length)} van {sortedPapers.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30" style={{ color: '#5a5550' }}><ChevronFirst size={16} /></button>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30" style={{ color: '#5a5550' }}><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              const isCurrent = pageNum === currentPage;
              return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-all duration-200" style={{ backgroundColor: isCurrent ? '#3d8c87' : 'transparent', color: isCurrent ? '#ffffff' : '#5a5550' }}>{pageNum}</button>;
            })}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30" style={{ color: '#5a5550' }}><ChevronRight size={16} /></button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30" style={{ color: '#5a5550' }}><ChevronLast size={16} /></button>
          </div>
          <span className="text-[13px]" style={{ color: '#5a5550' }}>{ITEMS_PER_PAGE} per pagina</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedPaper ? (
          <motion.aside key={selectedPaper.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} transition={{ duration: 0.25, ease: easeOutExpo }} className="w-[340px] shrink-0 flex flex-col overflow-y-auto border-l" style={{ backgroundColor: '#ffffff', borderColor: '#e5e1dc' }}>
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-[18px] font-normal leading-[1.3] break-words" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>{selectedPaper.title}</h2>
            </div>
            <div className="px-5 pb-3">
              <p className="text-[14px] font-medium leading-relaxed" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#5a5550' }}>{selectedPaper.creators.length > 200 ? selectedPaper.creators.substring(0, 200) + ' et al.' : selectedPaper.creators}</p>
            </div>
            <div className="px-5 pb-4">
              <span className="text-[14px] font-medium tabular-nums" style={{ fontFamily: "'Source Code Pro', monospace", color: '#8a827a' }}>{selectedPaper.year}</span>
              {selectedPaper.venue && <span className="text-[13px] ml-2" style={{ color: '#8a827a' }}>— {selectedPaper.venue}</span>}
              <div className="mt-3 border-b" style={{ borderColor: '#eeeae5' }} />
            </div>
            <div className="px-5 pb-3 flex items-center gap-2 flex-wrap">
              {selectedPaper.url && (
                <button onClick={() => window.open(selectedPaper.url!, '_blank')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200" style={{ color: '#5a5550', backgroundColor: '#f4f1ed' }}>
                  <ExternalLink size={14} />Open URL
                </button>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200" style={{ color: '#5a5550', backgroundColor: '#f4f1ed' }}><Download size={14} />PDF</button>
              <button onClick={() => { if (selectedPaper) { const citation = `${selectedPaper.creators} (${selectedPaper.year}). ${selectedPaper.title}. ${selectedPaper.venue || ''}.`; navigator.clipboard.writeText(citation); } }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200" style={{ color: '#5a5550', backgroundColor: '#f4f1ed' }}><Copy size={14} />Citaat</button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200" style={{ color: '#5a5550', backgroundColor: '#f4f1ed' }}><Bookmark size={14} />Opslaan</button>
            </div>
            <div className="mx-5 border-b" style={{ borderColor: '#eeeae5' }} />
            <div className="px-5 py-3">
              <h3 className="text-[14px] font-semibold mb-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1c1917' }}>Metadata</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {selectedPaper.doi && (<><span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#8a827a' }}>DOI</span><a href={`https://doi.org/${selectedPaper.doi}`} target="_blank" rel="noopener noreferrer" className="text-[13px] hover:underline truncate" style={{ color: '#3d8c87' }}>{selectedPaper.doi}</a></>)}
                {selectedPaper.publisher && (<><span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#8a827a' }}>Uitgever</span><span className="text-[13px] truncate" style={{ color: '#5a5550' }}>{selectedPaper.publisher}</span></>)}
                {selectedPaper.pages && (<><span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#8a827a' }}>Pagina's</span><span className="text-[13px]" style={{ color: '#5a5550', fontFamily: "'Source Code Pro', monospace" }}>{selectedPaper.pages}</span></>)}
                {selectedPaper.collection && (<><span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#8a827a' }}>Collectie</span><span className="text-[13px] truncate" style={{ color: '#5a5550' }}>{selectedPaper.collection}</span></>)}
              </div>
            </div>
            <div className="mx-5 border-b" style={{ borderColor: '#eeeae5' }} />
            <div className="px-5 py-3">
              <h3 className="text-[14px] font-semibold mb-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1c1917' }}>Tags ({selectedPaper.tags.length})</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedPaper.tags.map((tag) => { const tc = getTagColor(tag); return <button key={tag} onClick={() => toggleTagFilter(tag)} className="inline-flex items-center px-2.5 py-1 text-[12px] font-medium rounded-[14px] transition-all duration-150 hover:opacity-80" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: tc.bgHex, color: tc.hex }}>{tag}</button>; })}
              </div>
            </div>
            {selectedPaper.abstract && (
              <><div className="mx-5 border-b" style={{ borderColor: '#eeeae5' }} /><div className="px-5 py-3">
                <h3 className="text-[14px] font-semibold mb-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1c1917' }}>Samenvatting</h3>
                <p className="text-[13px] leading-[1.7]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#5a5550' }}>{selectedPaper.abstract}</p>
              </div></>
            )}
          </motion.aside>
        ) : (
          <motion.aside key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="w-[340px] shrink-0 flex flex-col items-center justify-center border-l" style={{ backgroundColor: '#faf8f5', borderColor: '#e5e1dc' }}>
            <img src="/no-selection-illustration.svg" alt="Geen selectie" className="w-[160px] h-[120px] mb-4" />
            <h3 className="text-[16px] font-normal mb-1" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#1c1917' }}>Geen item geselecteerd</h3>
            <p className="text-[13px] text-center px-8" style={{ color: '#8a827a' }}>Selecteer een publicatie uit de lijst om details te bekijken.</p>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
