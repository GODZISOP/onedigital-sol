'use client';

import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

interface DesignerCanvasProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
  width?: number;
  height?: number;
}

export default function DesignerCanvas({ onCanvasReady, width = 200, height = 300 }: DesignerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && !fabricRef.current) {
      const canvasElement = document.createElement('canvas');
      canvasElement.width = width;
      canvasElement.height = height;
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(canvasElement);

      // Initialize Fabric.js Canvas
      const canvas = new fabric.Canvas(canvasElement, {
        width,
        height,
        preserveObjectStacking: true, // Keep selected object on top
      });
      
      fabricRef.current = canvas;
      onCanvasReady(canvas);
    }

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onCanvasReady, width, height]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
