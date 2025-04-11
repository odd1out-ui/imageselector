import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import  {fabric}  from 'fabric';

const API_KEY = 'i2cm3Y8uFmT4iI2MHTWpdgIsnMabl1vjKYXcxTNMm0p4NodXghNm7DMP';
const API_URL = 'https://api.pexels.com/v1/search';

export default function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  useEffect(() => {
    if (!selectedImageUrl || !canvasRef.current) return;
  
    
    if (fabricRef.current) {
      fabricRef.current.dispose();
    }
  
    // Create new canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#f0f0f0' 
    });
    fabricRef.current = canvas;
  
    loadImageToCanvas(selectedImageUrl, canvas);
  
    
    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
      }
    };
  }, [selectedImageUrl]);
  async function loadImageToCanvas(imageUrl, canvas) {
    try {
      
      fabric.Image.fromURL(imageUrl, (img) => {
        if (!img) {
          console.error("error");
          return;
        }
        
      
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        
        canvas.setBackgroundImage(img, () => {
          canvas.renderAll();
          console.log("✅ Image loaded successfully");
        }, {
          scaleX: scale,
          scaleY: scale,
          originX: 'left',
          originY: 'top'
        });
      }, {
        crossOrigin: 'anonymous' 
      });
    } catch (error) {
      console.error(" Error loading image ", error);
    }
  }  
  

  const fetchImages = async () => {
    if (!query) return alert('PLease enter search item');
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: API_KEY },
        params: { query, per_page: 9 },
      });
      setImages(response.data.photos);
    } catch (err) {
      alert('Failed to fetch images');
    }
  };

 
  
  const addText = () => {
    if (!fabricRef.current) return;
    const textbox = new fabric.Textbox('Text', {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: 'red',
    });
    fabricRef.current.add(textbox);
  };

  const addShape = (shape) => {
    if (!fabricRef.current) return;
    let shapeObj;
     
        shapeObj = new fabric.Circle({ radius: 30, fill: 'blue', left: 150, top: 150 });
      
  
        
    
    fabricRef.current.add(shapeObj);
  };

  const downloadImage = () => {
    if (!fabricRef.current) return;
    const dataUrl = fabricRef.current.toDataURL({ format: 'png' });
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'edited-image.png';
    link.click();
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Image  Editor</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search images..."
          className="border px-2 py-1 rounded w-full"
        />
        <button onClick={fetchImages} className="bg-blue-500 text-white px-4 py-1 rounded">
          Search
        </button>
      </div>

      <div className="grid grid-rows-2 grid-flow-col gap-4">
  {images.map((img) => (
    <div key={img.id} className="relative">
      <img src={img.src.small} alt={img.alt} className="w-full h-auto" />
      <button
        onClick={() => setSelectedImageUrl(img.src.large)}
        className="bg-green-600 text-white px-2 py-1 absolute bottom-2 left-2 rounded"
      >
        Add Captions
      </button>
    </div>
  ))}
</div>
      {selectedImageUrl && (
  <div className="mt-4">
    <canvas
      ref={canvasRef}
      width="600"
      height="400"
      style={{ border: '2px solid black' }}
    ></canvas>
  </div>
)}



      <div className="flex gap-2 mb-4">
        <button onClick={addText} >
          Add Text
        </button>
        <button onClick={() => addShape()} >
          Shape
        </button>
        
        <button onClick={downloadImage} >
          Download
        </button>
      </div>
    </div>
  );
}
