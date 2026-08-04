import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';

interface ImageDragDropZoneProps {
  label: string;
  subLabel?: string;
  imageUrl: string;
  onImageChange: (url: string) => void;
  aspectRatio?: 'auto' | 'video' | 'square';
  placeholderText?: string;
}

export const ImageDragDropZone: React.FC<ImageDragDropZoneProps> = ({
  label,
  subLabel,
  imageUrl,
  onImageChange,
  aspectRatio = 'video',
  placeholderText = '이미지 파일을 이 곳에 끌어다 놓으세요 (Drag & Drop) 또는 클릭하여 올리기'
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다 (JPG, PNG, GIF, WebP 등).');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('파일 용량이 50MB를 초과합니다. 50MB 이하의 이미지를 올려주세요.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onImageChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : 'min-h-[180px]';

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#2EB0A6]" />
          {label}
        </label>
        {subLabel && <span className="text-[11px] font-bold text-slate-500">{subLabel}</span>}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full ${aspectClass} rounded-2xl border-2 transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
          isDragging
            ? 'border-[#2EB0A6] bg-[#2EB0A6]/10 scale-[1.01] shadow-[0_0_15px_rgba(46,176,166,0.4)]'
            : imageUrl
            ? 'border-slate-900 bg-slate-900 shadow-[3px_3px_0px_0px_#0A0A0A]'
            : 'border-dashed border-slate-400 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-900'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />

        {imageUrl ? (
          <div className="relative w-full h-full group">
            <img
              src={imageUrl}
              alt="Uploaded Visualization"
              className="w-full h-full object-contain bg-slate-950/90"
            />
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
              <span className="px-2.5 py-1 bg-emerald-500 text-white font-extrabold text-[10px] rounded-lg shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 이미지 등록됨
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange('');
                }}
                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-md"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none">
              <Upload className="w-6 h-6 mb-1 text-[#2EB0A6]" />
              <span className="text-xs font-bold">클릭하거나 다른 이미지를 드래그해서 교체</span>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center space-y-2 pointer-events-none">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#FFF2E8] border border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0A0A0A]">
              <Upload className={`w-5 h-5 ${isDragging ? 'text-[#2EB0A6] animate-bounce' : 'text-slate-800'}`} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-extrabold text-slate-800">
                {isDragging ? '🚀 여기에 놓으시면 바로 업로드됩니다!' : placeholderText}
              </p>
              <p className="text-[10px] font-medium text-slate-500">
                JPG, PNG, GIF, WebP (드래그 앤 드롭 또는 파일 탐색기 선택 · 용량 50MB 이하)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
