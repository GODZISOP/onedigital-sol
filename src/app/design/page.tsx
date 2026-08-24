'use client';

import { useState, useCallback, useEffect } from 'react';
import * as fabric from 'fabric';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { Type, Shirt, Image as ImageIcon, Shirt as ShirtViewIcon, Download, Eye, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Palette, Grid } from 'lucide-react';
import styles from './Design.module.css';
import { CLIPART_CATEGORIES as BASE_CLIPART_CATEGORIES, CLIPART_DATA as BASE_CLIPART_DATA, ClipartItem } from './clipartData';
import scrapedIconsData from './scraped-icons.json';

// Combine the two data sources safely
const scrapedIcons: ClipartItem[] = scrapedIconsData as ClipartItem[];
const CLIPART_DATA = [...BASE_CLIPART_DATA, ...scrapedIcons];
const CLIPART_CATEGORIES = Array.from(new Set([...BASE_CLIPART_CATEGORIES, ...scrapedIcons.map(i => i.category)]));

const FONT_CATEGORIES = [
  'All',
  'Standard',
  'Handwriting / Script',
  'Sci-Fi / Modern',
  'College / Sports',
  'Retro / Vintage',
  'Serif / Old Style'
];

const FONTS = [
  { name: 'Roboto', category: 'Standard' },
  { name: 'Open Sans', category: 'Standard' },
  { name: 'Lato', category: 'Standard' },
  { name: 'Montserrat', category: 'Standard' },
  { name: 'Oswald', category: 'Standard' },
  { name: 'Caveat', category: 'Handwriting / Script' },
  { name: 'Pacifico', category: 'Handwriting / Script' },
  { name: 'Satisfy', category: 'Handwriting / Script' },
  { name: 'Dancing Script', category: 'Handwriting / Script' },
  { name: 'Great Vibes', category: 'Handwriting / Script' },
  { name: 'Orbitron', category: 'Sci-Fi / Modern' },
  { name: 'Rajdhani', category: 'Sci-Fi / Modern' },
  { name: 'Syncopate', category: 'Sci-Fi / Modern' },
  { name: 'Audiowide', category: 'Sci-Fi / Modern' },
  { name: 'Press Start 2P', category: 'Sci-Fi / Modern' },
  { name: 'Black Ops One', category: 'College / Sports' },
  { name: 'Anton', category: 'College / Sports' },
  { name: 'Russo One', category: 'College / Sports' },
  { name: 'Bebas Neue', category: 'College / Sports' },
  { name: 'Graduate', category: 'College / Sports' },
  { name: 'Righteous', category: 'Retro / Vintage' },
  { name: 'Creepster', category: 'Retro / Vintage' },
  { name: 'Bungee', category: 'Retro / Vintage' },
  { name: 'Lobster', category: 'Retro / Vintage' },
  { name: 'Fascinate', category: 'Retro / Vintage' },
  { name: 'Playfair Display', category: 'Serif / Old Style' },
  { name: 'Merriweather', category: 'Serif / Old Style' },
  { name: 'Lora', category: 'Serif / Old Style' },
  { name: 'Cinzel', category: 'Serif / Old Style' },
];

const DesignerCanvas = dynamic(() => import('@/components/DesignerCanvas'), { ssr: false });

type ViewType = 'front' | 'back' | 'right' | 'left';

const COLORS = Array.from(new Set([
  '#FFFFFF', '#F5F5DC', '#000000', '#E0E0E0', '#D3D3D3', '#191970', '#0056b3', '#008B8B', '#ADD8E6', '#708090', '#4B0082', '#DC143C', 
  '#8B0000', '#FF8C00', '#F5DEB3', '#FF4500', '#006400', '#556B2F', '#FFDEAD', '#9370DB', '#FF7F50', '#DAA520', '#7CFC00', '#FFE4E1',
  '#FFC107', '#6495ED', '#FF69B4', '#32CD32', '#9ACD32', '#808000', '#87CEEB', '#A52A2A', '#C71585', '#00FA9A', '#008080', '#FF6347',
  '#900C3F', '#483D8B', '#A0522D', '#FA8072', '#6B8E23', '#F08080', '#CD5C5C', '#8B4513', '#696969', '#B0C4DE', '#3b5998', '#D2691E',
  '#008000', '#778899', '#27408B', '#C1E1C1', '#D2B48C', '#000080', '#DA70D6', '#CD853F', '#F4A460',
  '#2F4F4F', '#E9967A', '#FFF8DC', '#4682B4', '#1E4D2B', '#2E0854', '#004225'
]));

export default function DesignPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'shirt' | 'text' | 'image' | 'clipart'>('shirt');
  const [shirtColor, setShirtColor] = useState('#FFFFFF');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const savedColor = sessionStorage.getItem('designerShirtColor');
    if (savedColor) {
      setShirtColor(savedColor);
    }
    const storedView = sessionStorage.getItem('designerCurrentView');
    if (storedView) {
      setCurrentView(storedView as ViewType);
    }
    const storedStates = sessionStorage.getItem('designerCanvasStates');
    if (storedStates) {
      try {
        setCanvasStates(JSON.parse(storedStates));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('designerShirtColor', shirtColor);
    }
  }, [shirtColor, isLoaded]);
  
  // Quote & Buy State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteImage, setQuoteImage] = useState<string | null>(null);
  const [quantities, setQuantities] = useState({ S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 });
  const totalQuantity = Object.values(quantities).reduce((a, b) => a + (parseInt(b as any) || 0), 0);
  
  const [renderTrigger, setRenderTrigger] = useState(0);
  
  // Preview State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [charSpacing, setCharSpacing] = useState(0);
  const [hasOutline, setHasOutline] = useState(false);
  const [outlineColor, setOutlineColor] = useState('#ff0000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('center');
  const [hasShadow, setHasShadow] = useState(false);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontCategoryFilter, setFontCategoryFilter] = useState('All');

  const [clipartSearch, setClipartSearch] = useState('');
  const [clipartColor, setClipartColor] = useState('#000000');
  const [clipartCategoryFilter, setClipartCategoryFilter] = useState('All');

  const [currentView, setCurrentView] = useState<ViewType>('front');

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('designerCurrentView', currentView);
    }
  }, [currentView, isLoaded]);

  const [canvasStates, setCanvasStates] = useState<Record<ViewType, any>>({ front: null, back: null, right: null, left: null });

  // Keep sessionStorage in sync whenever canvasStates changes
  useEffect(() => {
    if (isLoaded) {
      try {
        sessionStorage.setItem('designerCanvasStates', JSON.stringify(canvasStates));
      } catch (e) {
        console.warn('Could not save canvas states, storage limit may be exceeded', e);
      }
    }
  }, [canvasStates, isLoaded]);

  const [activeObject, setActiveObject] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);

  // Dynamic Pricing Calculation
  const getPricingBreakdown = () => {
    let breakdown = { basePrice: 6.98, frontPrice: 0, backPrice: 0, leftPrice: 0, rightPrice: 0 };

    const analyzeCanvas = (canvasObjects: any[], view: ViewType) => {
      if (!canvasObjects || canvasObjects.length === 0) return 0;
      let total = 0;

      canvasObjects.forEach(obj => {
        const isUpload = obj.sourceType === 'upload';
        const isText = obj.sourceType === 'text' || obj.type === 'i-text' || obj.type === 'text';
        const isClipart = obj.sourceType === 'clipart' || (!isUpload && !isText);

        if (view === 'front') {
          if (isUpload) total += 6.02;
          else if (isText) total += 5.02;
          else if (isClipart) total += 5.02;
        } else if (view === 'back') {
          if (isUpload) total += 7.02;
          else if (isText) total += 6.02;
          else if (isClipart) total += 6.02;
        } else {
          // Sleeves (Left/Right)
          if (isUpload) total += 1.50;
          else if (isText) total += 1.50;
          else if (isClipart) total += 1.50;
        }
      });

      return total;
    };

    // Use unified JSON state for all views to ensure consistency
    const statesToAnalyze = { ...canvasStates };
    if (canvas) {
      if (canvas.getObjects().length > 0) {
        statesToAnalyze[currentView] = canvas.toJSON(['sourceType']);
      } else {
        statesToAnalyze[currentView] = null;
      }
    }

    Object.keys(statesToAnalyze).forEach(key => {
      const view = key as ViewType;
      if (statesToAnalyze[view]?.objects?.length > 0) {
        const cost = analyzeCanvas(statesToAnalyze[view].objects, view);
        if (view === 'front') breakdown.frontPrice = cost;
        if (view === 'back') breakdown.backPrice = cost;
        if (view === 'left') breakdown.leftPrice = cost;
        if (view === 'right') breakdown.rightPrice = cost;
      }
    });

    return breakdown;
  };

  const pricing = getPricingBreakdown();
  const PRICE_PER_SHIRT = parseFloat((pricing.basePrice + pricing.frontPrice + pricing.backPrice + pricing.leftPrice + pricing.rightPrice).toFixed(2));
  const totalPrice = (totalQuantity * PRICE_PER_SHIRT).toFixed(2);

  const handleCanvasReady = useCallback((fabCanvas: any) => {
    setCanvas(fabCanvas);
  }, []);

  const handleResetDesign = () => {
    if (confirm('Are you sure you want to completely clear this design?')) {
      if (canvas) canvas.clear();
      Object.keys(canvasStates).forEach(k => {
        canvasStates[k as ViewType] = null;
      });
      setCanvasStates({...canvasStates});
      setShirtColor('#FFFFFF');
      sessionStorage.removeItem('designerCanvasData');
      sessionStorage.removeItem('designerShirtColor');
      sessionStorage.removeItem('designerCanvasStates');
      if (canvas) canvas.renderAll();
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const updateStateFromObject = (obj: any) => {
      if (!obj) return;
      
      if (obj.type === 'i-text' || obj.type === 'text') {
        setActiveTab('text');
        
        setTextInput(obj.get('text') || '');
        setFontFamily(obj.get('fontFamily') as string || 'Roboto');
        setTextColor(obj.get('fill') as string || '#000000');
        setCharSpacing((obj.get('charSpacing') as number || 0) / 10);
        
        setHasOutline(!!obj.get('stroke'));
        setOutlineColor(obj.get('stroke') as string || '#ff0000');
        
        setIsBold(obj.get('fontWeight') === 'bold');
        setIsItalic(obj.get('fontStyle') === 'italic');
        setIsUnderline(!!obj.get('underline'));
        setTextAlign(obj.get('textAlign') as string || 'left');
        
        const shadow = obj.get('shadow') as any;
        setHasShadow(!!shadow);
        if (shadow) {
          setShadowColor(shadow.color || '#000000');
        }
      } else if (obj.type === 'path' || obj.type === 'group') {
        setActiveTab('clipart');
        if (obj.type === 'path') {
          const fill = obj.get('fill');
          if (fill && typeof fill === 'string' && fill !== 'none') setClipartColor(fill);
          else if (obj.get('stroke')) setClipartColor(obj.get('stroke') as string);
        } else if (obj.type === 'group' && (obj as fabric.Group)._objects) {
          const firstPath = (obj as fabric.Group)._objects.find(o => o.get('fill') && o.get('fill') !== 'none' || o.get('stroke'));
          if (firstPath) {
            const fill = firstPath.get('fill');
            if (fill && typeof fill === 'string' && fill !== 'none') setClipartColor(fill);
            else setClipartColor(firstPath.get('stroke') as string);
          }
        }
      } else if (obj.type === 'image' || obj.sourceType === 'upload') {
        setActiveTab('image');
      }
    };

    const saveCanvasState = () => {
      try {
        const json = canvas.toJSON(['sourceType']);
        sessionStorage.setItem('designerCanvasData', JSON.stringify(json));
      } catch (e) {
        console.warn('Could not save canvas data, storage limit may be exceeded', e);
      }
      setRenderTrigger(prev => prev + 1); // Force re-render to update pricing
    };

    const handleSelection = (e: any) => {
      const selected = e.selected?.[0];
      if (selected) {
        setActiveObject(selected);
        updateStateFromObject(selected);
      }
    };

    const handleCleared = () => {
      setActiveObject(null);
    };

    const handleModified = (e: any) => {
      saveCanvasState();
      if (activeObject && e.target === activeObject) {
        updateStateFromObject(e.target);
      }
    };

    const handleAdded = () => saveCanvasState();
    const handleRemoved = () => saveCanvasState();

    // Restore from session storage if exists
    const storedCanvas = sessionStorage.getItem('designerCanvasData');
    if (storedCanvas && !canvas.getObjects().length) {
      canvas.loadFromJSON(JSON.parse(storedCanvas)).then(() => {
        canvas.renderAll();
      }).catch((e: any) => {
        console.error("Failed to restore canvas:", e);
      });
    }

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleCleared);
    canvas.on('object:modified', handleModified);
    canvas.on('object:added', handleAdded);
    canvas.on('object:removed', handleRemoved);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleCleared);
      canvas.off('object:modified', handleModified);
      canvas.off('object:added', handleAdded);
      canvas.off('object:removed', handleRemoved);
    };
  }, [canvas, activeObject]);

  useEffect(() => {
    if (!activeObject || !canvas || activeTab !== 'text') return;
    
    let needsRender = false;
    
    if (activeObject.fontFamily !== fontFamily) {
      document.fonts.load(`16px "${fontFamily}"`).then(() => {
        activeObject.set('fontFamily', fontFamily);
        canvas.requestRenderAll();
      });
    }
    if (activeObject.fill !== textColor) {
      activeObject.set('fill', textColor);
      needsRender = true;
    }
    if (activeObject.charSpacing !== charSpacing * 10) {
      activeObject.set('charSpacing', charSpacing * 10);
      needsRender = true;
    }
    if (activeObject.text !== textInput) {
      activeObject.set('text', textInput);
      needsRender = true;
    }
    
    const currentStroke = hasOutline ? outlineColor : null;
    const currentStrokeWidth = hasOutline ? 2 : 0;
    
    if (activeObject.stroke !== currentStroke || activeObject.strokeWidth !== currentStrokeWidth) {
      activeObject.set('stroke', currentStroke);
      activeObject.set('strokeWidth', currentStrokeWidth);
      needsRender = true;
    }

    if (activeObject.fontWeight !== (isBold ? 'bold' : 'normal')) {
      activeObject.set('fontWeight', isBold ? 'bold' : 'normal');
      needsRender = true;
    }
    if (activeObject.fontStyle !== (isItalic ? 'italic' : 'normal')) {
      activeObject.set('fontStyle', isItalic ? 'italic' : 'normal');
      needsRender = true;
    }
    if (activeObject.underline !== isUnderline) {
      activeObject.set('underline', isUnderline);
      needsRender = true;
    }
    if (activeObject.textAlign !== textAlign) {
      activeObject.set('textAlign', textAlign);
      needsRender = true;
    }
    
    const oldShadowColor = activeObject.shadow ? (activeObject.shadow as any).color : null;
    const newShadowColor = hasShadow ? shadowColor : null;
    if (oldShadowColor !== newShadowColor) {
       activeObject.set('shadow', hasShadow ? { color: shadowColor, blur: 5, offsetX: 3, offsetY: 3 } : null);
       needsRender = true;
    }
    
    if (needsRender) {
      canvas.requestRenderAll();
    }
  }, [fontFamily, textColor, charSpacing, hasOutline, outlineColor, isBold, isItalic, isUnderline, textAlign, hasShadow, shadowColor, textInput, activeObject, canvas, activeTab]);

  useEffect(() => {
    if (!canvas || !activeObject || activeTab !== 'clipart') return;
    if (activeObject.type === 'i-text' || activeObject.type === 'text') return;

    const applyColor = (obj: any) => {
      // Do not apply color if the original SVG specifically had fill="none" and stroke="none" (like bounding boxes)
      // Tabler icons use this for bounding boxes.
      if (obj.get('fill') === '' || obj.get('fill') === null || obj.get('fill') === 'none') {
         if (obj.get('stroke') === '' || obj.get('stroke') === null || obj.get('stroke') === 'none') {
           return; // skip completely invisible objects
         }
      }

      if (obj.get('fill') && obj.get('fill') !== 'none' && obj.get('fill') !== 'transparent') {
        obj.set('fill', clipartColor);
      }
      if (obj.get('stroke') && obj.get('stroke') !== 'none' && obj.get('stroke') !== 'transparent') {
        obj.set('stroke', clipartColor);
      }
    };

    if (activeObject.type === 'group') {
      (activeObject as fabric.Group).forEachObject(applyColor);
    } else {
      applyColor(activeObject);
    }
    canvas.requestRenderAll();
  }, [clipartColor, activeObject, canvas, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        if (activeObject && canvas) {
          e.preventDefault();
          canvas.remove(activeObject);
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          setActiveObject(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeObject, canvas]);

  const handleAddText = async () => {
    if (!canvas) return;
    const text = new fabric.IText(textInput || 'New Text', {
      left: 100,
      top: 100,
      fontFamily: fontFamily,
      fill: textColor,
      fontSize: 30,
      charSpacing: charSpacing * 10,
      sourceType: 'text'
    } as any);
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result as string;
      try {
        const img = await fabric.FabricImage.fromURL(data);
        img.scaleToWidth(200);
        img.set({ left: 100, top: 100, sourceType: 'upload' } as any);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      } catch (err) {
        console.error("Error loading image:", err);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddClipart = async (svgString: string) => {
    if (!canvas) return;
    try {
      const { objects, options } = await fabric.loadSVGFromString(svgString);
      const validObjects = objects.filter(obj => obj !== null) as any[];
      const obj = fabric.util.groupSVGElements(validObjects, options);
      obj.set({ left: 100, top: 100, sourceType: 'clipart' } as any);
      obj.scaleToWidth(100);
      
      // Apply selected color
      const applyColor = (o: any) => {
        if (o.get('fill') === '' || o.get('fill') === null || o.get('fill') === 'none') {
           if (o.get('stroke') === '' || o.get('stroke') === null || o.get('stroke') === 'none') {
             return; // skip completely invisible objects
           }
        }
        if (o.get('fill') && o.get('fill') !== 'none' && o.get('fill') !== 'transparent') o.set('fill', clipartColor);
        if (o.get('stroke') && o.get('stroke') !== 'none' && o.get('stroke') !== 'transparent') o.set('stroke', clipartColor);
      };
      
      if (obj.type === 'group') {
        (obj as fabric.Group).forEachObject(applyColor);
      } else {
        applyColor(obj);
      }
      
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
    } catch (err) {
      console.error("Error loading SVG", err);
    }
  };

  const handleDownload = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `my-design-${currentView}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteText = () => {
    if (activeObject && canvas) {
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      setActiveObject(null);
    }
  };

  const handleViewChange = (newView: ViewType) => {
    if (newView === currentView || !canvas) return;
    const currentJson = canvas.toJSON(['sourceType']);
    setCanvasStates(prev => ({ ...prev, [currentView]: currentJson }));
    
    const newJson = canvasStates[newView];
    if (newJson) {
      canvas.loadFromJSON(newJson).then(() => { canvas.requestRenderAll(); });
    } else {
      canvas.clear();
    }
    
    setActiveObject(null);
    setTextInput('');
    setCurrentView(newView);
  };

  const getShirtImageSrc = () => {
    switch (currentView) {
      case 'back': return '/templates/shirt-back.png';
      case 'left': return '/templates/shirt-left.png';
      case 'right': return '/templates/shirt-right.png';
      default: return '/templates/shirt-front.png';
    }
  };
  const shirtImageSrc = getShirtImageSrc();

  const generateCompositeImage = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (canvas) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }

      const compositeCanvas = document.createElement('canvas');
      compositeCanvas.width = 500;
      compositeCanvas.height = 600;
      const ctx = compositeCanvas.getContext('2d');
      if (!ctx) return reject('No canvas context');

      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = shirtImageSrc;
      
      img.onload = () => {
        const scale = Math.min(500 / img.width, 600 / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (500 - w) / 2;
        const y = (600 - h) / 2;
        
        ctx.drawImage(img, x, y, w, h);
        
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = shirtColor;
        ctx.fillRect(0, 0, 500, 600);
        
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(img, x, y, w, h);
        
        ctx.globalCompositeOperation = 'source-over';
        if (canvas) {
          const designImg = new window.Image();
          designImg.onload = () => {
            ctx.drawImage(designImg, 0, 0, 500, 600);
            resolve(compositeCanvas.toDataURL('image/png'));
          };
          designImg.src = canvas.toDataURL({ format: 'png', multiplier: 1 });
        } else {
          resolve(compositeCanvas.toDataURL('image/png'));
        }
      };
      
      img.onerror = (err) => reject(err);
    });
  };

  const generateImageForView = async (view: ViewType): Promise<string> => {
    const isCurrent = currentView === view;
    const state = isCurrent || !canvasStates[view] ? null : JSON.parse(JSON.stringify(canvasStates[view]));
    
    return new Promise<string>((resolve, reject) => {
      const doComposite = (designDataUrl: string) => {
         const compositeCanvas = document.createElement('canvas');
         compositeCanvas.width = 500;
         compositeCanvas.height = 600;
         const ctx = compositeCanvas.getContext('2d');
         if (!ctx) return resolve('');
         
         const img = new window.Image();
         img.crossOrigin = 'Anonymous';
         if (view === 'front') img.src = '/templates/shirt-front.png';
         else if (view === 'back') img.src = '/templates/shirt-back.png';
         else if (view === 'left') img.src = '/templates/shirt-left.png';
         else img.src = '/templates/shirt-right.png';
         
         img.onload = () => {
           const scale = Math.min(500 / img.width, 600 / img.height);
           const w = img.width * scale;
           const h = img.height * scale;
           const x = (500 - w) / 2;
           const y = (600 - h) / 2;
           
           ctx.drawImage(img, x, y, w, h);
           
           ctx.globalCompositeOperation = 'source-in';
           ctx.fillStyle = shirtColor;
           ctx.fillRect(0, 0, 500, 600);
           
           ctx.globalCompositeOperation = 'multiply';
           ctx.drawImage(img, x, y, w, h);
           
           ctx.globalCompositeOperation = 'source-over';
           if (designDataUrl) {
             const designImg = new window.Image();
             designImg.onload = () => {
               ctx.drawImage(designImg, 0, 0, 500, 600);
               resolve(compositeCanvas.toDataURL('image/png'));
             };
             designImg.src = designDataUrl;
           } else {
             resolve(compositeCanvas.toDataURL('image/png'));
           }
         };
         img.onerror = reject;
      };

      if (isCurrent && canvas) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        doComposite(canvas.toDataURL({ format: 'png', multiplier: 1 }));
      } else if (state) {
        const offscreenEl = document.createElement('canvas');
        offscreenEl.width = 500;
        offscreenEl.height = 600;
        const staticCanvas = new fabric.StaticCanvas(offscreenEl);
        staticCanvas.loadFromJSON(state, () => {
          staticCanvas.renderAll();
          // Small delay allows fabric to finish drawing i-text on the offscreen canvas
          setTimeout(() => {
            doComposite(staticCanvas.toDataURL({ format: 'png', multiplier: 1 }));
          }, 150);
        });
      } else {
        doComposite('');
      }
    });
  };

  const handleSaveDesign = async () => {
    try {
      const viewsToDownload: ViewType[] = ['front', 'back', 'left', 'right'];
      
      for (const view of viewsToDownload) {
        const state = view === currentView ? (canvas ? canvas.toJSON(['sourceType']) : null) : canvasStates[view];
        
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const doComposite = (designDataUrl: string) => {
             const compositeCanvas = document.createElement('canvas');
             compositeCanvas.width = 500;
             compositeCanvas.height = 600;
             const ctx = compositeCanvas.getContext('2d');
             if (!ctx) return resolve('');
             
             const img = new window.Image();
             if (view === 'front') img.src = '/templates/shirt-front.png';
             else if (view === 'back') img.src = '/templates/shirt-back.png';
             else if (view === 'left') img.src = '/templates/shirt-left.png';
             else img.src = '/templates/shirt-right.png';
             
             img.onload = () => {
               const scale = Math.min(500 / img.width, 600 / img.height);
               const w = img.width * scale;
               const h = img.height * scale;
               const x = (500 - w) / 2;
               const y = (600 - h) / 2;
               
               ctx.drawImage(img, x, y, w, h);
               
               ctx.globalCompositeOperation = 'source-in';
               ctx.fillStyle = shirtColor;
               ctx.fillRect(0, 0, 500, 600);
               
               ctx.globalCompositeOperation = 'multiply';
               ctx.drawImage(img, x, y, w, h);
               
               ctx.globalCompositeOperation = 'source-over';
               if (designDataUrl) {
                 const designImg = new window.Image();
                 designImg.onload = () => {
                   ctx.drawImage(designImg, 0, 0, 500, 600);
                   resolve(compositeCanvas.toDataURL('image/png'));
                 };
                 designImg.src = designDataUrl;
               } else {
                 resolve(compositeCanvas.toDataURL('image/png'));
               }
             };
             img.onerror = reject;
          };

          if (view === currentView && canvas) {
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            doComposite(canvas.toDataURL({ format: 'png', multiplier: 1 }));
          } else if (state) {
            const offscreenEl = document.createElement('canvas');
            offscreenEl.width = 500;
            offscreenEl.height = 600;
            const staticCanvas = new fabric.StaticCanvas(offscreenEl);
            staticCanvas.loadFromJSON(state, () => {
              staticCanvas.renderAll();
              setTimeout(() => {
                doComposite(staticCanvas.toDataURL({ format: 'png', multiplier: 1 }));
              }, 150);
            });
          } else {
            doComposite('');
          }
        });

        if (dataUrl) {
          const link = document.createElement('a');
          link.download = `my-custom-shirt-${view}.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          // Small delay to prevent browser blocking multiple downloads
          await new Promise(r => setTimeout(r, 500));
        }
      }
    } catch (err) {
      console.error("Error saving design:", err);
    }
  };

  const handlePreview = async () => {
    try {
      const dataUrl = await generateCompositeImage();
      setPreviewImage(dataUrl);
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error("Error generating preview:", err);
    }
  };
  const handleCheckout = async () => {
    if (totalQuantity <= 0) {
      alert("Please select at least 1 shirt size before proceeding.");
      return;
    }

    // Users can order blank shirts if they want to.

    try {
      const frontImage = await generateImageForView('front');
      const backImage = await generateImageForView('back');
      const leftImage = await generateImageForView('left');
      const rightImage = await generateImageForView('right');
      
      const designColors = new Set<string>();
      const frontColors = new Set<string>();
      const backColors = new Set<string>();
      const leftColors = new Set<string>();
      const rightColors = new Set<string>();
      let textCount = 0;
      let patchCount = 0;

      const processObjects = (objects: any[], isFront: boolean, isBack: boolean, isLeft: boolean, isRight: boolean) => {
        objects.forEach((obj: any) => {
          const objType = (obj.type || '').toLowerCase().replace('-', '');
          const addColor = (color: string) => {
            if (!color || color === 'none' || color === 'transparent') return;
            designColors.add(color);
            if (isFront) frontColors.add(color);
            if (isBack) backColors.add(color);
            if (isLeft) leftColors.add(color);
            if (isRight) rightColors.add(color);
          };

          if (objType === 'itext' || objType === 'text' || obj.sourceType === 'text') {
            textCount++;
            addColor(obj.fill || '#000000');
            if (obj.stroke) addColor(obj.stroke);
            if (obj.shadow?.color) addColor(obj.shadow.color);
          } else if (objType === 'path' || objType === 'image' || obj.sourceType === 'upload') {
            patchCount++;
            addColor(obj.fill || '#000000');
            if (obj.stroke) addColor(obj.stroke);
          } else if (objType === 'group' || obj.sourceType === 'clipart') {
            patchCount++;
            const groupObjs = obj.objects || obj._objects || [];
            groupObjs.forEach((o: any) => {
              addColor(o.fill || '#000000');
              if (o.stroke) addColor(o.stroke);
            });
          }
        });
      };

      const views: ViewType[] = ['front', 'back', 'left', 'right'];
      let latestStates = canvasStates;
      try {
        const stored = sessionStorage.getItem('designerCanvasStates');
        if (stored) latestStates = JSON.parse(stored);
      } catch(e) {}

      const getRealObjects = async (v: ViewType): Promise<any[]> => {
        if (currentView === v && canvas) return canvas.getObjects();
        const state = latestStates[v];
        if (!state || !state.objects || state.objects.length === 0) return [];
        // Read colors directly from JSON objects (no need to instantiate Fabric canvas)
        return state.objects;
      };

      const frontObjs = await getRealObjects('front');
      const backObjs = await getRealObjects('back');
      const leftObjs = await getRealObjects('left');
      const rightObjs = await getRealObjects('right');

      console.log('[DEBUG] frontObjs:', JSON.stringify(frontObjs.map((o:any) => ({ type: o.type, sourceType: o.sourceType, fill: o.fill }))));
      console.log('[DEBUG] backObjs:', JSON.stringify(backObjs.map((o:any) => ({ type: o.type, sourceType: o.sourceType, fill: o.fill }))));

      processObjects(frontObjs, true, false, false, false);
      processObjects(backObjs, false, true, false, false);
      processObjects(leftObjs, false, false, true, false);
      processObjects(rightObjs, false, false, false, true);

      console.log('[DEBUG] frontColors:', Array.from(frontColors), 'backColors:', Array.from(backColors));

      const basePrice = totalQuantity * pricing.basePrice;
      const decorationPrice = totalQuantity * (pricing.frontPrice + pricing.backPrice + pricing.leftPrice + pricing.rightPrice);
      const finalPrice = basePrice + decorationPrice;

      const newCheckoutData = {
        shirtColor,
        quantities,
        pricePerShirt: PRICE_PER_SHIRT,
        totalPrice: finalPrice.toFixed(2),
        frontImage: frontImage,
        backImage: backImage,
        leftImage: leftImage,
        rightImage: rightImage,
        designColors: Array.from(designColors),
        frontColors: Array.from(frontColors),
        backColors: Array.from(backColors),
        leftColors: Array.from(leftColors),
        rightColors: Array.from(rightColors),
        pricingBreakdown: {
          basePrice: basePrice,
          decorationPrice: decorationPrice
        }
      };
      
      let existingState = {};
      try {
        existingState = JSON.parse(sessionStorage.getItem('checkoutState') || '{}');
      } catch (e) {}
      
      try {
        const mergedState = { ...existingState, ...newCheckoutData };
        sessionStorage.setItem('checkoutState', JSON.stringify(mergedState));
        sessionStorage.setItem('checkoutStep', '0'); // Reset step to Summary
      } catch (e) {
        console.warn('Could not save checkout state', e);
        // Fallback to avoid breaking navigation
        sessionStorage.setItem('checkoutStep', '0');
      }

      // Save the latest state for the current view to ensure it's not lost on back navigation
      if (canvas) {
        try {
          const updatedStates = { ...canvasStates, [currentView]: canvas.toJSON(['sourceType']) };
          sessionStorage.setItem('designerCanvasStates', JSON.stringify(updatedStates));
        } catch (e) {
          console.warn('Could not save canvas states', e);
        }
      }

      router.push('/checkout');
    } catch (err) {
      console.error("Error during checkout:", err);
      alert("Failed to proceed to checkout. Please try again.");
    }
  };


  const handleOpenQuoteModal = async () => {
    try {
      const dataUrl = await generateCompositeImage();
      setQuoteImage(dataUrl);
      setIsQuoteModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate quote image.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button className={`${styles.toolbarBtn} ${activeTab === 'shirt' ? styles.active : ''}`} onClick={() => setActiveTab('shirt')}><Shirt size={24} />CHOOSE SHIRT</button>
          <button className={`${styles.toolbarBtn} ${activeTab === 'text' ? styles.active : ''}`} onClick={() => setActiveTab('text')}><Type size={24} />ADD TEXT</button>
          <button className={`${styles.toolbarBtn} ${activeTab === 'image' ? styles.active : ''}`} onClick={() => setActiveTab('image')}><ImageIcon size={24} />UPLOAD IMAGE</button>
          <button className={`${styles.toolbarBtn} ${activeTab === 'clipart' ? styles.active : ''}`} onClick={() => setActiveTab('clipart')}><Grid size={24} />CLIPART</button>
        </div>
        <div className={styles.toolbarRight}>
          <div className={styles.pricePerShirt}>
            <strong>${PRICE_PER_SHIRT.toFixed(2)}</strong>
            <small>per shirt ({totalQuantity})</small>
          </div>
          <button className={styles.saveBtn} onClick={handleResetDesign} style={{ color: '#dc3545', borderColor: '#dc3545' }}>Reset</button>
          <button className={styles.quoteBtn} onClick={handleOpenQuoteModal}>Quote & Buy</button>
        </div>
      </div>

      <div className={styles.mainArea}>
        <aside className={styles.sidebar}>
          {activeTab === 'shirt' && (
            <div>
              <h3 className={styles.sidebarTitle}>Choose Color</h3>
              <div className={styles.colorGrid}>
                {COLORS.map(color => (
                  <button
                    key={color}
                    className={`${styles.colorSwatch} ${shirtColor === color ? styles.active : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setShirtColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div>
              <h3 className={styles.sidebarTitle}>{activeObject ? 'Edit Text' : 'Add Custom Text'}</h3>
              <input 
                type="text" 
                className={styles.textInput}
                placeholder="Enter text..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              
              <div style={{ marginBottom: '1rem', position: 'relative' }}>
                <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Font Family</label>
                
                {/* Custom Font Picker Button */}
                <div 
                  onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                  style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: fontFamily,
                    fontSize: '1.2rem'
                  }}
                >
                  <span>{fontFamily}</span>
                  <span>▼</span>
                </div>

                {/* Dropdown Menu */}
                {isFontDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    borderRadius: '4px',
                    marginTop: '4px',
                    maxHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Category Filter */}
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
                      <select 
                        value={fontCategoryFilter}
                        onChange={(e) => setFontCategoryFilter(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                      >
                        {FONT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>

                    {/* Font List */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                      {FONTS.filter(f => fontCategoryFilter === 'All' || f.category === fontCategoryFilter).map(font => (
                        <div 
                          key={font.name}
                          onClick={() => {
                            setFontFamily(font.name);
                            setIsFontDropdownOpen(false);
                          }}
                          style={{
                            padding: '0.75rem',
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer',
                            fontFamily: font.name,
                            fontSize: '1.5rem',
                            backgroundColor: fontFamily === font.name ? '#e6f2ff' : '#fff',
                          }}
                        >
                          {font.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Spacing</label>
                  <input 
                    type="number" 
                    className={styles.textInput}
                    value={charSpacing}
                    onChange={(e) => setCharSpacing(parseInt(e.target.value) || 0)}
                    step="10"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Color</label>
                  <input 
                    type="color" 
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{ width: '100%', height: '40px', padding: '0', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setIsBold(!isBold)} 
                  style={{ flex: 1, padding: '0.5rem', fontWeight: 'bold', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: isBold ? '#e0e0e0' : '#f9f9f9', cursor: 'pointer' }}>B</button>
                <button 
                  onClick={() => setIsItalic(!isItalic)} 
                  style={{ flex: 1, padding: '0.5rem', fontStyle: 'italic', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: isItalic ? '#e0e0e0' : '#f9f9f9', cursor: 'pointer' }}>I</button>
                <button 
                  onClick={() => setIsUnderline(!isUnderline)} 
                  style={{ flex: 1, padding: '0.5rem', textDecoration: 'underline', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: isUnderline ? '#e0e0e0' : '#f9f9f9', cursor: 'pointer' }}>U</button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setTextAlign('left')} 
                  style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: textAlign === 'left' ? '#e0e0e0' : '#f9f9f9', cursor: 'pointer' }}>Left</button>
                <button 
                  onClick={() => setTextAlign('center')} 
                  style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: textAlign === 'center' ? '#e0e0e0' : '#f9f9f9', cursor: 'pointer' }}>Center</button>
                <button 
                  onClick={() => setTextAlign('right')} 
                  style={{ flex: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: textAlign === 'right' ? '#e0e0e0' : '#f9f9f9', cursor: 'pointer' }}>Right</button>
              </div>

              <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="outlineCheck"
                  checked={hasOutline}
                  onChange={(e) => setHasOutline(e.target.checked)}
                />
                <label htmlFor="outlineCheck" style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1 }}>Add Outline</label>
                
                {hasOutline && (
                  <input 
                    type="color" 
                    value={outlineColor}
                    onChange={(e) => setOutlineColor(e.target.value)}
                    style={{ width: '30px', height: '30px', padding: '0', cursor: 'pointer' }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="shadowCheck"
                  checked={hasShadow}
                  onChange={(e) => setHasShadow(e.target.checked)}
                />
                <label htmlFor="shadowCheck" style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1 }}>Drop Shadow</label>
                
                {hasShadow && (
                  <input 
                    type="color" 
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    style={{ width: '30px', height: '30px', padding: '0', cursor: 'pointer' }}
                  />
                )}
              </div>

              {!activeObject ? (
                <button className={styles.actionBtn} onClick={handleAddText}>Add Text</button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#28a745', fontWeight: 'bold' }}>
                    Text is selected. Any changes made above will instantly update the design!
                  </p>
                  <button 
                    onClick={handleDeleteText}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete Text
                  </button>
                </div>
              )}
              
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
                You can click and drag the text on the shirt to move, resize, or rotate it!
              </p>
            </div>
          )}

          {activeTab === 'image' && (
            <div>
              <h3 className={styles.sidebarTitle}>Upload Image</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Upload a custom image (PNG, JPG, SVG) to add to your design.
              </p>
              
              <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer'
                  }}
                />
                <button className={styles.actionBtn}>Select File to Upload</button>
              </div>

              {activeObject && (
                <div style={{ marginTop: '1rem' }}>
                  <button 
                    onClick={handleDeleteText}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete Selected Image
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'clipart' && (
            <div>
              <h3 className={styles.sidebarTitle}>Add Clipart</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Color:</label>
                  <input 
                    type="color" 
                    value={clipartColor}
                    onChange={(e) => setClipartColor(e.target.value)}
                    style={{ width: '40px', height: '40px', padding: '0', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>(Set color before adding, or select clipart to change)</span>
                </div>

                <select 
                  value={clipartCategoryFilter} 
                  onChange={(e) => setClipartCategoryFilter(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                >
                  <option value="All">All Categories</option>
                  {CLIPART_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input 
                  type="text" 
                  placeholder="Search clipart..." 
                  value={clipartSearch}
                  onChange={(e) => setClipartSearch(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '0.5rem',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #eee'
              }}>
                {CLIPART_DATA.filter(item => {
                  const matchCat = clipartCategoryFilter === 'All' || item.category === clipartCategoryFilter;
                  const matchSearch = item.name.toLowerCase().includes(clipartSearch.toLowerCase());
                  return matchCat && matchSearch;
                }).map(item => (
                  <div 
                    key={item.id}
                    onClick={() => handleAddClipart(item.svg)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#000'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#ddd'}
                  >
                    <div 
                      style={{ width: '40px', height: '40px', color: clipartColor }}
                      dangerouslySetInnerHTML={{ __html: item.svg }}
                    />
                    <span style={{ fontSize: '0.7rem', marginTop: '0.25rem', textAlign: 'center' }}>{item.name}</span>
                  </div>
                ))}
              </div>

              {activeObject && (
                <div style={{ marginTop: '1rem' }}>
                  <button 
                    onClick={handleDeleteText}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete Selected
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div style={{ marginTop: '3rem' }}>
            <h3 className={styles.sidebarTitle}>Actions</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              <button className={styles.actionBtn} onClick={handlePreview}>
                <Eye size={20} /> Preview Design
              </button>
              <button className={styles.actionBtn} style={{ backgroundColor: '#28a745' }} onClick={handleSaveDesign}>
                <Download size={20} /> Download Design
              </button>
            </div>
          </div>
        </aside>

        <section className={styles.canvasContainer}>
          <div className={styles.shirtWrapper} id="shirt-preview-container">
            {/* Tint layer for the color, masked to the exact shape of the shirt */}
            <div 
              className={styles.shirtTint}
              style={{
                backgroundColor: shirtColor,
                maskImage: `url('${shirtImageSrc}')`,
                WebkitMaskImage: `url('${shirtImageSrc}')`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 1
              }}
            ></div>
            
            {/* The white shirt image for texture, multiplying over the tint */}
            <div 
              className={styles.shirtImage}
              style={{
                backgroundImage: `url('${shirtImageSrc}')`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                mixBlendMode: 'multiply',
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 2,
                pointerEvents: 'none'
              }}
            ></div>
            
            <div className={styles.fabricCanvasWrapper} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}>
              <DesignerCanvas onCanvasReady={setCanvas} width={500} height={600} />
            </div>
          </div>

          <div className={styles.viewSwitcher}>
            <button 
              className={`${styles.viewBtn} ${currentView === 'front' ? styles.active : ''}`}
              onClick={() => handleViewChange('front')}
            >
              <div className={styles.viewIcon}><ShirtViewIcon size={32} color="#666" /></div>
              <span className={styles.viewLabel}>FRONT</span>
            </button>
            <button 
              className={`${styles.viewBtn} ${currentView === 'back' ? styles.active : ''}`}
              onClick={() => handleViewChange('back')}
            >
              <div className={styles.viewIcon}><ShirtViewIcon size={32} color="#666" /></div>
              <span className={styles.viewLabel}>BACK</span>
            </button>
            <button 
              className={`${styles.viewBtn} ${currentView === 'left' ? styles.active : ''}`}
              onClick={() => handleViewChange('left')}
            >
              <div className={styles.viewIcon}><ShirtViewIcon size={32} color="#666" /></div>
              <span className={styles.viewLabel}>LEFT SLEEVE</span>
            </button>
            <button 
              className={`${styles.viewBtn} ${currentView === 'right' ? styles.active : ''}`}
              onClick={() => handleViewChange('right')}
            >
              <div className={styles.viewIcon}><ShirtViewIcon size={32} color="#666" /></div>
              <span className={styles.viewLabel}>RIGHT SLEEVE</span>
            </button>
          </div>
        </section>
      </div>

      {/* Quote & Buy Modal */}
      {isQuoteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Untitled T-Shirt</h2>
              <div className={styles.modalHeaderRight}>
                <button className={styles.closeBtn} onClick={() => setIsQuoteModalOpen(false)}>×</button>
              </div>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalLeftPanel}>
                <h3>Total inks: 0</h3>
              </div>
              <div className={styles.modalRightPanel}>
                <div className={styles.shirtDetails}>
                  <div className={styles.shirtThumbnailWrapper} style={{ position: 'relative', width: '80px', height: '80px', border: '1px solid #ddd', borderRadius: '4px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {quoteImage && (
                      <img src={quoteImage} alt="Design Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                  </div>
                  <div className={styles.shirtInfo}>
                    <h4>T-Shirts &gt; Short Sleeve Shirts</h4>
                    <h2>Gildan Cotton T-Shirt</h2>
                    <div className={styles.price}>${PRICE_PER_SHIRT} <small>/ea</small></div>
                  </div>
                </div>
                
                <div className={styles.sizeInputs}>
                  {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
                    <div key={size} className={styles.sizeBox}>
                      <label>{size}</label>
                      <input 
                        type="number" 
                        min="0" 
                        value={quantities[size as keyof typeof quantities] || 0}
                        onChange={(e) => setQuantities({...quantities, [size]: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <div className={styles.totalPrice}>
                ${totalPrice} <small>In-Store Pickup</small>
              </div>
              <button 
                className={styles.checkoutBtn} 
                onClick={handleCheckout}
                disabled={totalQuantity === 0}
                style={{ 
                  opacity: totalQuantity === 0 ? 0.5 : 1, 
                  cursor: totalQuantity === 0 ? 'not-allowed' : 'pointer' 
                }}
              >
                Go to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Preview Modal */}
      {isPreviewModalOpen && previewImage && (
        <div className={styles.modalOverlay} style={{ zIndex: 2000 }} onClick={() => setIsPreviewModalOpen(false)}>
          <div className={styles.modalContent} style={{ width: 'auto', padding: '0', backgroundColor: 'transparent', boxShadow: 'none' }} onClick={e => e.stopPropagation()}>
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Design Preview</h2>
                <button className={styles.closeBtn} onClick={() => setIsPreviewModalOpen(false)}>×</button>
              </div>
              <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
                <img src={previewImage} alt="Design Preview" style={{ width: '500px', height: '600px', objectFit: 'contain' }} />
              </div>
              <button className={styles.quoteBtn} style={{ marginTop: '1.5rem', width: '100%', padding: '1rem' }} onClick={() => { setIsPreviewModalOpen(false); handleSaveDesign(); }}>
                Download This Design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
