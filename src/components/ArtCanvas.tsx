import React, { useEffect, useRef, useState } from 'react';
import { Pane } from 'tweakpane';

// Créer une interface pour le type Pane
interface TweakPane {
  readonly element: HTMLElement;
  addBlade(config: any): any;
  add(target: object, key: string, opt_params?: any): any;
  dispose(): void;
}

interface Params {
  gridSize: number;
  circleRadius: number;
  randomizeCircleRadius: boolean;
  randomizeArc: boolean;
  randomizeOpacity: boolean;
  randomizePosition: boolean;
}

const ArtCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<Params>({
    gridSize: 10,
    circleRadius: 5,
    randomizeCircleRadius: true,
    randomizeArc: false,
    randomizeOpacity: false,
    randomizePosition: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;

      const drawGrid = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'red';
        const circleSize = width / params.gridSize;

        for (let gridX = 0; gridX < width; gridX += circleSize) {
          for (let gridY = 0; gridY < height; gridY += circleSize) {
            const centerX = params.randomizePosition
              ? gridX + circleSize / 2 + (Math.random() - 0.5) * circleSize
              : gridX + circleSize / 2;
            const centerY = params.randomizePosition
              ? gridY + circleSize / 2 + (Math.random() - 0.5) * circleSize
              : gridY + circleSize / 2;
            
            const radius = params.randomizeCircleRadius
              ? Math.random() * params.circleRadius
              : params.circleRadius;

            const startAngle = params.randomizeArc ? Math.random() * Math.PI * 2 : 0;
            const endAngle = params.randomizeArc 
              ? startAngle + Math.random() * Math.PI * 2 
              : Math.PI * 2;

            if (params.randomizeOpacity) {
              ctx.globalAlpha = Math.random();
            }

            ctx.beginPath();
            ctx.arc(
              centerX,
              centerY,
              radius,
              startAngle,
              endAngle
            );
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
      };

      drawGrid();
    }
  }, [params]);

  useEffect(() => {
    // Créer l'objet de paramètres
    const PARAMS = { ...params };
    
    // Créer le panneau
    const pane = new Pane() as unknown as TweakPane;

    // Ajouter les contrôles
    pane.add(PARAMS, 'gridSize', { 
      min: 2, 
      max: 50, 
      step: 1,
      label: 'Grid Size'
    }).on('change', ({ value }) => {
      setParams(prev => ({ ...prev, gridSize: value }));
    });

    pane.add(PARAMS, 'circleRadius', { 
      min: 1, 
      max: 20, 
      step: 1,
      label: 'Circle Radius'
    }).on('change', ({ value }) => {
      setParams(prev => ({ ...prev, circleRadius: value }));
    });

    pane.add(PARAMS, 'randomizeCircleRadius')
      .on('change', ({ value }) => {
        setParams(prev => ({ ...prev, randomizeCircleRadius: value }));
      });

    pane.add(PARAMS, 'randomizeArc')
      .on('change', ({ value }) => {
        setParams(prev => ({ ...prev, randomizeArc: value }));
      });

    pane.add(PARAMS, 'randomizeOpacity')
      .on('change', ({ value }) => {
        setParams(prev => ({ ...prev, randomizeOpacity: value }));
      });

    pane.add(PARAMS, 'randomizePosition')
      .on('change', ({ value }) => {
        setParams(prev => ({ ...prev, randomizePosition: value }));
      });

    return () => {
      pane.dispose();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      id="canvas" 
      style={{ 
        width: '500px', 
        height: '500px',
        border: '1px solid #ccc'
      }}
    />
  );
};

export default ArtCanvas;