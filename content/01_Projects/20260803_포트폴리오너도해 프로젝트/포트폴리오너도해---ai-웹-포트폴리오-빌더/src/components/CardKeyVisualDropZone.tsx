import React, { useState } from 'react';
import { Upload, ImageIcon, CheckCircle2 } from 'lucide-react';

interface CardKeyVisualDropZoneProps {
  blockId: string;
  thumbnailUrl: string;
  badgeText?: string;
  onUpdateThumbnail?: (blockId: string, newUrl: string) => void;
  className?: string;
}

export const CardKeyVisualDropZone: React.FC<CardKeyVisualDropZoneProps> = ({
  blockId,
  thumbnailUrl,
  badgeText,
  onUpdateThumbnail,
  className = 'h-48'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
        if (onUpdateThumbnail) {
          onUpdateThumbnail(blockId, reader.result);
        }
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2500);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const displayImage = thumbnailUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full ${className} rounded-2xl border-2 border-slate-900 overflow-hidden mb-4 shadow-[3px_3px_0px_0px_#0A0A0A] bg-slate-950 transition-all ${
        isDragging
          ? 'ring-4 ring-[#2EB0A6] border-[#2EB0A6] scale-[1.02] shadow-[0_0_20px_rgba(46,176,166,0.5)]'
          : ''
      }`}
    >
      {/* Background Key Visual Image */}
      <img
        src={displayImage}
        alt="Key Visual Cover"
        className={`w-full h-full object-cover transition-transform duration-300 ${
          isDragging ? 'opacity-40 blur-xs scale-105' : 'group-hover:scale-105'
        }`}
      />

      {/* Top Left Project Badge */}
      {badgeText && (
        <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 bg-slate-900/90 text-white font-black text-[11px] rounded-lg border border-slate-700 backdrop-blur-xs">
          {badgeText}
        </div>
      )}

      {/* Top Right File Size Guide Badge */}
      <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 bg-slate-900/80 text-[#38D0C3] font-extrabold text-[10px] rounded-md border border-slate-700/80 backdrop-blur-xs flex items-center gap-1">
        <Upload className="w-3 h-3 text-[#38D0C3]" />
        이미지 드래그 가능 (50MB 이하)
      </div>

      {/* Dragging Active Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-20 bg-[#0A0A0C]/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-2 animate-fade-in pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-[#2EB0A6] text-white flex items-center justify-center shadow-lg animate-bounce">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-black text-[#38D0C3]">🚀 시각화 이미지 여기에 놓기!</p>
            <p className="text-xs text-slate-300 font-bold">용량 50MB 이하의 이미지가 적용됩니다</p>
          </div>
        </div>
      )}

      {/* Upload Success Feedback */}
      {uploadSuccess && (
        <div className="absolute inset-0 z-20 bg-emerald-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-1 animate-fade-in pointer-events-none">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
          <p className="text-xs font-black text-emerald-300">시각화 이미지가 성공적으로 변경되었습니다!</p>
        </div>
      )}

      {/* Hover Replace Button Overlay */}
      {!isDragging && onUpdateThumbnail && (
        <div className="absolute inset-0 z-10 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white">
          <label
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 bg-[#2EB0A6] hover:bg-[#238C84] text-white text-xs font-black rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0A0A0A] cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            시각화 이미지 교체 (드래그 or 클릭)
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <span className="text-[10px] text-slate-200 font-bold mt-1.5 drop-shadow-md">
            마우스로 이 자리에 이미지를 끌어다 놓으셔도 됩니다 (50MB 이하)
          </span>
        </div>
      )}
    </div>
  );
};
