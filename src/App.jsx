import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment } from '@react-three/drei';
import Lightsaber from './components/Lightsaber';
import './App.css';

function App() {
  // État de la configuration
  const [config, setConfig] = useState({
    showRing1: true,
    showRing2: true,
    colors: {
      global: '#ffffff',
      pommel: '#cccccc',
      ring1: '#ff0000',
      body: '#cccccc',
      ring2: '#ff0000',
      emitter: '#cccccc',
    },
  });

  // Gestion des changements de couleur
  const handleColorChange = (part, color) => {
    setConfig((prev) => {
      const newColors = { ...prev.colors };
      if (part === 'global') {
        // Si on change la couleur globale, on peut soit tout changer, 
        // soit juste mettre à jour la valeur 'global' utilisée comme fallback
        newColors.global = color;
        newColors.pommel = color;
        newColors.ring1 = color;
        newColors.body = color;
        newColors.ring2 = color;
        newColors.emitter = color;
      } else {
        newColors[part] = color;
      }
      return { ...prev, colors: newColors };
    });
  };

  // Gestion des checkboxes
  const toggleRing = (ring) => {
    setConfig((prev) => ({
      ...prev,
      [ring]: !prev[ring],
    }));
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      
      {/* Sidebar de configuration */}
      <div className="sidebar" style={{ width: '300px', padding: '20px', background: '#f0f0f0', overflowY: 'auto' }}>
        <h1>LS Creator</h1>
        
        <div className="control-group">
          <h3>Structure</h3>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input 
              type="checkbox" 
              checked={config.showRing1} 
              onChange={() => toggleRing('showRing1')} 
            /> Montrer Anneau 1
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input 
              type="checkbox" 
              checked={config.showRing2} 
              onChange={() => toggleRing('showRing2')} 
            /> Montrer Anneau 2
          </label>
        </div>

        <div className="control-group">
          <h3>Couleurs</h3>
          
          <div className="color-input">
            <label>Globale</label>
            <input 
              type="color" 
              value={config.colors.global} 
              onChange={(e) => handleColorChange('global', e.target.value)} 
            />
          </div>

          <hr style={{ margin: '15px 0' }} />

          <div className="color-input">
            <label>Pommeau</label>
            <input 
              type="color" 
              value={config.colors.pommel} 
              onChange={(e) => handleColorChange('pommel', e.target.value)} 
            />
          </div>

          {config.showRing1 && (
            <div className="color-input">
              <label>Anneau 1</label>
              <input 
                type="color" 
                value={config.colors.ring1} 
                onChange={(e) => handleColorChange('ring1', e.target.value)} 
              />
            </div>
          )}

          <div className="color-input">
            <label>Corps</label>
            <input 
              type="color" 
              value={config.colors.body} 
              onChange={(e) => handleColorChange('body', e.target.value)} 
            />
          </div>

          {config.showRing2 && (
            <div className="color-input">
              <label>Anneau 2</label>
              <input 
                type="color" 
                value={config.colors.ring2} 
                onChange={(e) => handleColorChange('ring2', e.target.value)} 
              />
            </div>
          )}

          <div className="color-input">
            <label>Émetteur</label>
            <input 
              type="color" 
              value={config.colors.emitter} 
              onChange={(e) => handleColorChange('emitter', e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Zone 3D */}
      <div className="canvas-container" style={{ flex: 1, background: '#111' }}>
        <Canvas shadows camera={{ position: [350, 350, 350], fov: 50 }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              <Lightsaber config={config} />
            </Stage>
            <OrbitControls makeDefault />
          </Suspense>
        </Canvas>
      </div>

    </div>
  );
}

export default App;