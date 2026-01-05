
import React from 'react';
import { Plus, Minus, Heart, Flame } from 'lucide-react';

interface ControlsProps {
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
  isHot: boolean;
  onToggleHot: () => void;
  eqActive: boolean;
  fxActive: boolean;
  onToggleEq: () => void;
  onToggleFx: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onPlayPause,
  onPrev,
  onNext,
  isLiked,
  onToggleLike,
  isHot,
  onToggleHot,
  eqActive,
  fxActive,
  onToggleEq,
  onToggleFx
}) => {
  return (
    <div className="w-full grid grid-cols-3 gap-2 items-start">
      {/* Left Col: Plus Button + Speaker */}
      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={onNext}
          className="w-12 h-12 rounded-full bg-[#e0e0e0] shadow-[4px_4px_10px_#bebebe,-4px_-4px_10px_#ffffff] flex items-center justify-center text-black active:shadow-[inset_2px_2px_6px_#bebebe,inset_-2px_-2px_6px_#ffffff] transition-all"
        >
          <Plus size={20} />
        </button>

        {/* Speaker Grille - Smaller dots */}
        <div className="grid grid-cols-6 gap-1 opacity-30 px-2">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-black shadow-inner" />
          ))}
        </div>
      </div>

      {/* Center Col: Like/Hot Toggle */}
      <div className="flex flex-col items-center justify-start pt-1.5">
        <div className="bg-[#cdcdcd] p-1 rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] flex gap-1">
          <button 
            onClick={onToggleLike}
            className={`w-11 h-7 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-[#2de37e] shadow-[0_0_12px_rgba(45,227,126,0.5)] text-white' : 'text-black/30'}`}
          >
            <Heart size={14} fill={isLiked ? "white" : "none"} />
          </button>
          <button 
            onClick={onToggleHot}
            className={`w-11 h-7 rounded-full flex items-center justify-center transition-all ${isHot ? 'bg-[#ff6b35] shadow-[0_0_12px_rgba(255,107,53,0.5)] text-white' : 'text-black/30'}`}
          >
            <Flame size={14} fill={isHot ? "white" : "none"} />
          </button>
        </div>
        <div className="mt-12 text-center">
            <h3 className="text-xs font-bold opacity-30 tracking-widest">DOLBY</h3>
            <span className="text-[9px] opacity-20">HI-RES AUDIO</span>
        </div>
      </div>

      {/* Right Col: Minus + EQ/FX */}
      <div className="flex flex-col items-center gap-6">
        <button 
          onClick={onPrev}
          className="w-12 h-12 rounded-full bg-[#e0e0e0] shadow-[4px_4px_10px_#bebebe,-4px_-4px_10px_#ffffff] flex items-center justify-center text-black active:shadow-[inset_2px_2px_6px_#bebebe,inset_-2px_-2px_6px_#ffffff] transition-all"
        >
          <Minus size={20} />
        </button>

        {/* EQ / FX Box */}
        <div className="bg-[#b8b8b8] p-2 rounded-xl shadow-[inset_4px_4px_10px_rgba(0,0,0,0.2)] flex flex-col gap-2">
          <button 
            onClick={onToggleEq}
            className={`w-10 h-8 rounded-lg flex flex-col items-center justify-center text-[9px] font-bold transition-all ${eqActive ? 'bg-[#4a4a4a] text-white shadow-lg border border-white/10' : 'bg-black/5 text-black/40'}`}
          >
            <div className={`w-0.5 h-2 rounded-full mb-0.5 ${eqActive ? 'bg-orange-400' : 'bg-black/20'}`} />
            EQ
          </button>
          <button 
            onClick={onToggleFx}
            className={`w-10 h-8 rounded-lg flex flex-col items-center justify-center text-[9px] font-bold transition-all ${fxActive ? 'bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.5)] border border-white/20' : 'bg-black/5 text-black/40'}`}
          >
            FX
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
