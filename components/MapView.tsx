import React, { useRef, useState, useEffect, useCallback } from 'react';
import { MapMarker } from '../types';
import { PlusIcon, MinusIcon } from './Icons';

interface MapViewProps {
  imageSrc: string;
  markers: MapMarker[];
  onMarkerClick: (marker: MapMarker) => void;
  onMapClick: (x: number, y: number) => void;
  initialScale?: number;
  initialPosition?: { x: number; y: number };
}

const MIN_SCALE = 1;
const MAX_SCALE = 8;

const MapView: React.FC<MapViewProps> = ({ 
  imageSrc, 
  markers, 
  onMarkerClick, 
  onMapClick,
  initialScale = 1,
  initialPosition = { x: 0, y: 0 }
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });

  // Handle image load to center it initially if no props provided, but props take precedence
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgSize({ w: naturalWidth, h: naturalHeight });
  };

  // Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleSensitivity = 0.001;
    const delta = -e.deltaY * scaleSensitivity;
    const newScale = Math.min(Math.max(MIN_SCALE, scale + delta * scale), MAX_SCALE);
    
    // Zoom toward pointer logic could go here, simplistic center zoom for stability
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch handlers (Basic pinch zoom is complex, implementing basic drag for mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartPos({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - startPos.x;
    const newY = e.touches[0].clientY - startPos.y;
    setPosition({ x: newX, y: newY });
  };

  // Click on map (non-dragging click)
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    if (!containerRef.current) return;
    // For now, markers handle their own clicks.
  };

  const zoomIn = () => setScale(s => Math.min(s * 1.2, MAX_SCALE));
  const zoomOut = () => setScale(s => Math.max(s / 1.2, MIN_SCALE));

  return (
    <div className="relative w-full h-full bg-[#1a1512] overflow-hidden cursor-move select-none">
      
      {/* Map Container */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out origin-center will-change-transform"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onClick={handleClick}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <div className="relative shadow-2xl shadow-black">
          <img 
            src={imageSrc} 
            alt="Mapa Histórico Argentina 1882" 
            className="pointer-events-none max-w-none filter sepia contrast-125 brightness-90"
            onLoad={handleImageLoad}
            style={{ height: '90vh', objectFit: 'contain' }} // Base height
          />
          
          {/* Markers Layer */}
          <div className="absolute inset-0">
             {markers.map((marker) => (
               <button
                 key={marker.id}
                 onClick={(e) => {
                   e.stopPropagation(); // Prevent map drag start issues
                   onMarkerClick(marker);
                 }}
                 className="absolute group transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform duration-300 z-10"
                 style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
               >
                 <div className="relative">
                   {/* Smaller inner dot */}
                   <div className="w-3 h-3 bg-red-900 rounded-full border border-amber-200 shadow-[0_0_5px_rgba(0,0,0,0.8)] z-20 relative"></div>
                   {/* Smaller pulse ring */}
                   <div className="w-6 h-6 bg-red-900/40 rounded-full absolute -top-1.5 -left-1.5 animate-ping"></div>
                   
                   {/* Label tooltip */}
                   <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-amber-50 text-[10px] px-2 py-0.5 rounded whitespace-nowrap font-display pointer-events-none tracking-widest uppercase border border-amber-900/50">
                     {marker.label}
                   </div>
                 </div>
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-20">
        <button 
          onClick={zoomIn}
          className="p-3 bg-amber-900/90 text-amber-50 rounded-full hover:bg-amber-800 shadow-lg border border-amber-700/50 backdrop-blur-sm"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
        <button 
          onClick={zoomOut}
          className="p-3 bg-amber-900/90 text-amber-50 rounded-full hover:bg-amber-800 shadow-lg border border-amber-700/50 backdrop-blur-sm"
        >
          <MinusIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Instruction Overlay */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none select-none">
        <h1 className="text-3xl md:text-5xl font-display text-amber-50/90 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider">
          NORTE ARGENTINO
        </h1>
        <p className="text-amber-200/80 font-serif italic mt-2 drop-shadow-md max-w-sm">
          Leyendas de Salta, Jujuy, Tucumán y el Litoral.
        </p>
      </div>
    </div>
  );
};

export default MapView;