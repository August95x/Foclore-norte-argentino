import React, { useState, useRef } from 'react';
import MapView from './components/MapView';
import StoryPanel from './components/StoryPanel';
import { UploadIcon } from './components/Icons';
import { MapMarker, Story, AppState } from './types';
import { generateFolkloreStory } from './services/geminiService';

// Marcadores recalibrados para el mapa https://i.imgur.com/YAgBeh8.jpeg
// El mapa abarca latitud ~21S a 55S.
const NORTH_MARKERS: MapMarker[] = [
  { id: '1', label: 'Jujuy', x: 34.5, y: 7, regionContext: 'Quebrada de Humahuaca, el Coquena, Pachamama' },
  { id: '2', label: 'Salta', x: 34, y: 11, regionContext: 'Valles Calchaquíes, el Familiar, la Viuda' },
  { id: '3', label: 'Tucumán', x: 35.5, y: 16, regionContext: 'Selva de Yungas, el Mikilo, historias de la Zafra' },
  { id: '4', label: 'Sgo. del Estero', x: 41, y: 18, regionContext: 'Monte santiagueño, la Telesita, el Kakuy, Sacháyoj' },
  { id: '5', label: 'Catamarca', x: 30, y: 18.5, regionContext: 'Puna, Virgen del Valle, Salamanca' },
  { id: '6', label: 'Gran Chaco', x: 50, y: 12, regionContext: 'El Impenetrable, mitos Qom, el Pombero' },
  { id: '7', label: 'Corrientes', x: 58, y: 22, regionContext: 'Esteros del Iberá, el Lobizón, Curupí' },
  { id: '8', label: 'Misiones', x: 67, y: 16, regionContext: 'Cataratas, Yasí Yateré, Pombero' },
  { id: '9', label: 'La Rioja', x: 29, y: 23, regionContext: 'Chaya, Mikilo, cerros áridos' },
];

// Enlace directo a la imagen de Imgur proporcionada
const DEFAULT_MAP_URL = 'https://i.imgur.com/YAgBeh8.jpeg';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.EXPLORE);
  const [mapImage, setMapImage] = useState<string>(DEFAULT_MAP_URL);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleMarkerClick = async (marker: MapMarker) => {
    setAppState(AppState.READING);
    setIsLoadingStory(true);
    setCurrentStory(null);

    try {
      const result = await generateFolkloreStory(marker.label, marker.regionContext);
      setCurrentStory({
        title: result.title,
        content: result.story,
        region: marker.label
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingStory(false);
    }
  };

  const closeStory = () => {
    setAppState(AppState.EXPLORE);
    setCurrentStory(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMapImage(imageUrl);
    }
  };

  return (
    <div className="h-screen w-full bg-[#1a1512] overflow-hidden relative">
      {/* Vista del Mapa enfocada en el Norte */}
      <MapView 
        imageSrc={mapImage} 
        markers={NORTH_MARKERS} 
        onMarkerClick={handleMarkerClick}
        onMapClick={() => {}}
        initialScale={3.5} // Zoom un poco más profundo para el detalle
        initialPosition={{ x: 20, y: 500 }} // Ajustado para centrar mejor la parte superior
      />

      {/* Botón discreto para cambiar mapa */}
      <div className="absolute bottom-4 left-4 z-50">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group flex items-center gap-2 px-3 py-2 bg-black/40 hover:bg-amber-900/80 text-amber-50/50 hover:text-amber-50 rounded backdrop-blur-sm transition-all text-xs uppercase tracking-widest border border-transparent hover:border-amber-700"
          title="Usar tu propia imagen del mapa"
        >
          <UploadIcon className="w-4 h-4" />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-0 group-hover:w-auto overflow-hidden whitespace-nowrap">
            Cambiar Mapa
          </span>
        </button>
      </div>

      {/* Panel de Historia (Slide-over) */}
      {(appState === AppState.READING || isLoadingStory) && (
        <StoryPanel 
          story={currentStory} 
          isLoading={isLoadingStory} 
          onClose={closeStory} 
        />
      )}
    </div>
  );
};

export default App;