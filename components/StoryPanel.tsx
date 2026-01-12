import React from 'react';
import { Story } from '../types';
import { CloseIcon } from './Icons';

interface StoryPanelProps {
  story: Story | null;
  onClose: () => void;
  isLoading: boolean;
}

const StoryPanel: React.FC<StoryPanelProps> = ({ story, onClose, isLoading }) => {
  if (!story && !isLoading) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-[450px] bg-black/50 z-50 flex justify-end transition-opacity duration-300">
      <div className="h-full w-full md:w-[450px] paper-texture shadow-2xl flex flex-col relative border-l-4 border-amber-900/30 transform transition-transform duration-500 ease-out translate-x-0">
        
        {/* Decorative Header */}
        <div className="p-6 border-b border-amber-900/20 bg-amber-900/5 flex justify-between items-center">
          <h2 className="text-amber-900 font-display text-xl font-bold tracking-widest uppercase">
            {isLoading ? "Consultando los Archivos..." : "Archivo Folclórico"}
          </h2>
          <button 
            onClick={onClose}
            className="text-amber-800 hover:text-amber-600 transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-70">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-800 border-t-transparent"></div>
              <p className="text-amber-900 font-serif italic text-lg">Invocando leyenda...</p>
            </div>
          ) : story ? (
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                 <span className="text-amber-900/40 text-4xl">❧</span>
              </div>
              
              <h1 className="text-3xl font-display font-bold text-amber-950 text-center leading-tight">
                {story.title}
              </h1>
              
              <div className="w-16 h-1 bg-amber-900/30 mx-auto my-4"></div>
              
              <p className="text-amber-900/60 text-center uppercase tracking-widest text-xs font-bold mb-6">
                Región de {story.region} — Circa 1882
              </p>

              <div className="prose prose-amber prose-lg text-stone-800 text-justify leading-relaxed font-serif">
                {story.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 first-letter:text-4xl first-letter:font-display first-letter:float-left first-letter:mr-2 first-letter:text-amber-900">
                    {paragraph}
                  </p>
                ))}
              </div>

               <div className="flex justify-center mt-8">
                 <span className="text-amber-900/40 text-4xl">☙</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Decorative Footer */}
        <div className="p-4 bg-amber-900/10 text-center border-t border-amber-900/20">
          <p className="text-amber-900/50 text-xs font-display">
            República Argentina
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryPanel;
