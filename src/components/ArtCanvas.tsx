import React, { useEffect, useRef } from 'react';
import { Pane } from 'tweakpane';

interface CanvasParams {
  backgroundColor: string;
  imageOpacity: number;
  verticalSliceCount: number;
  horizontalSliceCount: number;
  verticalOffset: number;
  verticalFrequency: number;
  chromaticAberration: number;
  chromaticAngle: number;
  noiseIntensity: number;
}

interface UserAnswers {
  question1: number;
  question2: 'or' | 'argent' | null;
  question3: number;
  timestamp?: number;
}

export const ArtCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const overlayImageRef = useRef<HTMLImageElement | null>(null);
  const paneRef = useRef<Pane | null>(null);
  const isInitializedRef = useRef(false);

  const getUserAnswers = (): UserAnswers | null => {
    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
      const parsed: UserAnswers = JSON.parse(savedAnswers);
      const now = Date.now();
      
      if (parsed.timestamp && (now - parsed.timestamp) > 30 * 60 * 1000) {
        localStorage.removeItem('userAnswers');
        return null;
      }
      
      return parsed;
    }
    return null;
  };

  const convertAnswersToParams = (answers: UserAnswers): Partial<CanvasParams> => {
    if (!answers) return {};

    return {
      verticalSliceCount: Math.floor(answers.question1 * 5),
      imageOpacity: answers.question2 === 'or' ? 0.9 : 0.7,
      verticalOffset: answers.question3 * 10,
      chromaticAberration: answers.question1 * 3,
      chromaticAngle: answers.question2 === 'or' ? 45 : 135,
      noiseIntensity: answers.question3 / 10
    };
  };

  const params: CanvasParams = {
    backgroundColor: '#000000',
    imageOpacity: 1,
    verticalSliceCount: 0,
    horizontalSliceCount: 0,
    verticalOffset: 20,
    verticalFrequency: 1,
    chromaticAberration: 0,
    chromaticAngle: 0,
    noiseIntensity: 0
  };

  const loadImages = async (): Promise<[HTMLImageElement, HTMLImageElement]> => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
      });
    };

    const [baseImage, overlayImage] = await Promise.all([
      loadImage('/assets/image/cover_part1.png'),
      loadImage('/assets/image/cover_part2.png')
    ]);

    return [baseImage, overlayImage];
  };

  const applyChromaticAberration = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, params: CanvasParams) => {
    if (params.chromaticAberration <= 0) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;

    tempCtx.drawImage(ctx.canvas, x, y, width, height, 0, 0, width, height);

    const angle = (params.chromaticAngle * Math.PI) / 180;
    const offsetX = Math.cos(angle) * params.chromaticAberration;
    const offsetY = Math.sin(angle) * params.chromaticAberration;

    const channels = ['red', 'green', 'blue'].map((channel) => {
      const channelCanvas = document.createElement('canvas');
      channelCanvas.width = width;
      channelCanvas.height = height;
      const channelCtx = channelCanvas.getContext('2d');
      
      if (channelCtx) {
        channelCtx.drawImage(tempCanvas, 0, 0);
        
        const imageData = channelCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          switch(channel) {
            case 'red':
              data[i + 1] = 0;
              data[i + 2] = 0;
              break;
            case 'green':
              data[i] = 0;
              data[i + 2] = 0;
              break;
            case 'blue':
              data[i] = 0;
              data[i + 1] = 0;
              break;
          }
        }
        
        channelCtx.putImageData(imageData, 0, 0);
      }
      
      return channelCanvas;
    });

    ctx.clearRect(x, y, width, height);
    ctx.globalCompositeOperation = 'screen';
    
    ctx.drawImage(channels[0], x - offsetX, y - offsetY, width, height);
    ctx.drawImage(channels[1], x, y, width, height);
    ctx.drawImage(channels[2], x + offsetX, y + offsetY, width, height);

    ctx.globalCompositeOperation = 'source-over';
  };

  const applyNoise = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, params: CanvasParams) => {
    if (params.noiseIntensity <= 0) return;

    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = width;
    noiseCanvas.height = height;
    const noiseCtx = noiseCanvas.getContext('2d');

    if (noiseCtx) {
      noiseCtx.fillStyle = 'rgba(255, 255, 255, 0.10)';
      const grainSize = 1.5;
      const spacing = 3;

      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          if (Math.random() < params.noiseIntensity) {
            noiseCtx.beginPath();
            noiseCtx.arc(
              x + (Math.random() * spacing),
              y + (Math.random() * spacing),
              grainSize * Math.random(),
              0,
              Math.PI * 2
            );
            noiseCtx.fill();
          }
        }
      }

      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(noiseCanvas, x, y, width, height);
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  const drawCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number, params: CanvasParams) => {
    ctx.fillStyle = params.backgroundColor;
    ctx.fillRect(0, 0, width, height);
    
    if (baseImageRef.current) {
      const img = baseImageRef.current;
      const imageAspectRatio = img.width / img.height;
      const canvasAspectRatio = width / height;
      
      let drawWidth = width;
      let drawHeight = height;
      let x = 0;
      let y = 0;

      if (imageAspectRatio > canvasAspectRatio) {
        drawHeight = width / imageAspectRatio;
        y = (height - drawHeight) / 2;
      } else {
        drawWidth = height * imageAspectRatio;
        x = (width - drawWidth) / 2;
      }

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = drawWidth;
      tempCanvas.height = drawHeight;
      const tempCtx = tempCanvas.getContext('2d');

      if (tempCtx) {
        tempCtx.drawImage(img, 0, 0, drawWidth, drawHeight);
        let currentImage = tempCanvas;

        if (params.verticalSliceCount > 1) {
          const verticalSliceCanvas = document.createElement('canvas');
          verticalSliceCanvas.width = drawWidth;
          verticalSliceCanvas.height = drawHeight;
          const verticalSliceCtx = verticalSliceCanvas.getContext('2d');

          if (verticalSliceCtx) {
            verticalSliceCtx.clearRect(0, 0, drawWidth, drawHeight);
            const sliceWidth = drawWidth / params.verticalSliceCount;

            for (let i = 0; i < params.verticalSliceCount; i++) {
              const sourceX = i * sliceWidth;
              const offset = Math.sin(i * params.verticalFrequency * 0.1) * params.verticalOffset;

              verticalSliceCtx.drawImage(
                currentImage,
                sourceX, 0, sliceWidth, drawHeight,
                sourceX, offset, sliceWidth, drawHeight
              );
            }
            currentImage = verticalSliceCanvas;
          }
        }

        if (params.horizontalSliceCount > 1) {
          const horizontalSliceCanvas = document.createElement('canvas');
          horizontalSliceCanvas.width = drawWidth;
          horizontalSliceCanvas.height = drawHeight;
          const horizontalSliceCtx = horizontalSliceCanvas.getContext('2d');

          if (horizontalSliceCtx) {
            horizontalSliceCtx.clearRect(0, 0, drawWidth, drawHeight);
            const sliceHeight = drawHeight / params.horizontalSliceCount;

            for (let i = 0; i < params.horizontalSliceCount; i++) {
              const sourceY = i * sliceHeight;
              const offset = Math.sin(i * params.verticalFrequency * 0.1) * params.verticalOffset;

              horizontalSliceCtx.drawImage(
                currentImage,
                0, sourceY, drawWidth, sliceHeight,
                offset, sourceY, drawWidth, sliceHeight
              );
            }
            currentImage = horizontalSliceCanvas;
          }
        }

        ctx.globalAlpha = params.imageOpacity;
        ctx.drawImage(currentImage, x, y);

        applyChromaticAberration(ctx, x, y, drawWidth, drawHeight, params);

        ctx.globalAlpha = 1;

        if (overlayImageRef.current) {
          ctx.drawImage(overlayImageRef.current, x, y, drawWidth, drawHeight);
        }

        if (params.noiseIntensity > 0) {
          applyNoise(ctx, 0, 0, width, height, params);
        }
      }
    }
  };

  const initializeCanvas = async (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const computedStyle = window.getComputedStyle(canvas);
    const width = parseFloat(computedStyle.width) * 2;
    const height = parseFloat(computedStyle.height) * 2;
    canvas.width = width;
    canvas.height = height;

    try {
      const [baseImage, overlayImage] = await loadImages();
      baseImageRef.current = baseImage;
      overlayImageRef.current = overlayImage;

      const userAnswers = getUserAnswers();
      if (userAnswers) {
        const userParams = convertAnswersToParams(userAnswers);
        Object.assign(params, userParams);
      }

      const pane = new Pane();
      
      const backgroundFolder = pane.addFolder({ title: 'Background' });
      backgroundFolder.addBinding(params, 'backgroundColor', { view: 'color' })
        .on('change', () => drawCanvas(ctx, width, height, params));
      
      const verticalFolder = pane.addFolder({ title: 'Vertical Slices' });
      verticalFolder.addBinding(params, 'verticalSliceCount', { min: 0, max: 50, step: 1 })
        .on('change', () => drawCanvas(ctx, width, height, params));
      verticalFolder.addBinding(params, 'verticalOffset', { min: 0, max: 100, step: 1 })
        .on('change', () => drawCanvas(ctx, width, height, params));
      verticalFolder.addBinding(params, 'verticalFrequency', { min: 0.1, max: 5, step: 0.1 })
        .on('change', () => drawCanvas(ctx, width, height, params));

      const horizontalFolder = pane.addFolder({ title: 'Horizontal Slices' });
      horizontalFolder.addBinding(params, 'horizontalSliceCount', { min: 0, max: 50, step: 1 })
        .on('change', () => drawCanvas(ctx, width, height, params));

      const effectsFolder = pane.addFolder({ title: 'Visual Effects' });
      
      const chromaticFolder = effectsFolder.addFolder({ title: 'Chromatic Aberration' });
      chromaticFolder.addBinding(params, 'chromaticAberration', { min: 0, max: 10, step: 0.5 })
        .on('change', () => drawCanvas(ctx, width, height, params));
      chromaticFolder.addBinding(params, 'chromaticAngle', { min: 0, max: 360, step: 15 })
        .on('change', () => drawCanvas(ctx, width, height, params));

      const noiseFolder = effectsFolder.addFolder({ title: 'Grain' });
      noiseFolder.addBinding(params, 'noiseIntensity', { min: 0, max: 1, step: 0.05 })
        .on('change', () => drawCanvas(ctx, width, height, params));

      paneRef.current = pane;
      drawCanvas(ctx, width, height, params);
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitializedRef.current) return;

    isInitializedRef.current = true;
    initializeCanvas(canvas);

    return () => {
      if (paneRef.current) {
        paneRef.current.dispose();
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="art-canvas" />;
};

export default ArtCanvas;