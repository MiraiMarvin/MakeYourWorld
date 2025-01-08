import React, { useEffect, useRef, useState } from 'react';
import { Pane } from 'tweakpane';

interface Circle {
  x: number;
  y: number;
  radius: number;
}

export const ArtCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const paneRef = useRef<Pane | null>(null);
  const [circles, setCircles] = useState<Circle[]>([]);

  const paramsRef = useRef({
    GRID_SIZE: 10,
    RANDOMIZE_RADIUS: false,
  });

  const loadImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = '/assets/image/cover_v1.png';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });
  };
  
  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    const actualRadius = paramsRef.current.RANDOMIZE_RADIUS ? radius * Math.random() * 2 : radius;
    ctx.beginPath();
    ctx.arc(x, y, actualRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background shapes
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    const circleSize = width / paramsRef.current.GRID_SIZE;

    const newCircles: Circle[] = [];
    for (let gridX = 0; gridX < width; gridX += circleSize) {
      for (let gridY = 0; gridY < width; gridY += circleSize) {
        newCircles.push({
          x: gridX + circleSize / 2,
          y: gridY + circleSize / 2,
          radius: circleSize / 2
        });
      }
    }
    setCircles(newCircles);
    
    newCircles.forEach(circle => {
      drawCircle(ctx, circle.x, circle.y, circle.radius);
    });

    // Draw the image to fill the canvas while maintaining aspect ratio
    if (imageRef.current) {
      const img = imageRef.current;
      const imageAspectRatio = img.width / img.height;
      const canvasAspectRatio = width / height;
      
      let drawWidth = width;
      let drawHeight = height;
      let x = 0;
      let y = 0;

      // Calculate dimensions to maintain aspect ratio while filling the canvas
      if (imageAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas
        drawHeight = width / imageAspectRatio;
        y = (height - drawHeight) / 2;
      } else {
        // Image is taller than canvas
        drawWidth = height * imageAspectRatio;
        x = (width - drawWidth) / 2;
      }

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    }
  };

  const initializeCanvas = async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match the art-canvas class size * 2 for better resolution
    const computedStyle = window.getComputedStyle(canvas);
    const width = parseFloat(computedStyle.width) * 2;
    const height = parseFloat(computedStyle.height) * 2;
    canvas.width = width;
    canvas.height = height;

    try {
      // Load image first
      const img = await loadImage();
      imageRef.current = img;

      // Initialize Tweakpane
      const pane = new Pane();
      
      const PARAMS = {
        gridSize: 10,
        randomizeRadius: false,
      };

      pane.addBinding(PARAMS, 'gridSize', {
        min: 1,
        max: 20,
        step: 1,
      }).on('change', (ev) => {
        paramsRef.current.GRID_SIZE = ev.value;
        drawCanvas(ctx, width, height);
      });

      pane.addBinding(PARAMS, 'randomizeRadius').on('change', (ev) => {
        paramsRef.current.RANDOMIZE_RADIUS = ev.value;
        drawCanvas(ctx, width, height);
      });

      paneRef.current = pane;

      // Initial draw once everything is set up
      drawCanvas(ctx, width, height);
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    initializeCanvas(canvas);

    // Handle window resize
    const handleResize = () => {
      if (canvas && canvas.getContext('2d')) {
        const ctx = canvas.getContext('2d')!;
        const computedStyle = window.getComputedStyle(canvas);
        const width = parseFloat(computedStyle.width) * 2;
        const height = parseFloat(computedStyle.height) * 2;
        canvas.width = width;
        canvas.height = height;
        drawCanvas(ctx, width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (paneRef.current) {
        paneRef.current.dispose();
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="art-canvas"
    />
  );
};

export default ArtCanvas;