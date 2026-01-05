
import React, { useMemo } from 'react';
import { Battery, Wifi } from 'lucide-react';
import { Song, PlayerState } from '../types';

interface DisplayProps {
  song: Song;
  state: PlayerState;
  trackIndex: number;
}

const Display: React.FC<DisplayProps> = ({ song, state, trackIndex }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (state.currentTime / (song.duration || 1)) * 100;

  const currentLyricIndex = useMemo(() => {
    let index = 0;
    if (!song.lyrics) return 0;
    for (let i = 0; i < song.lyrics.length; i++) {
      if (state.currentTime >= song.lyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [state.currentTime, song.lyrics]);

  return (
    <div className="bg-[#121212] text-white p-5 rounded-3xl w-full h-64 flex flex-col relative overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] border border-white/5">
      {/* 顶部状态栏 */}
      <div className="flex justify-between items-center text-[10px] opacity-40 mb-1 font-mono tracking-wider z-20 shrink-0">
        <div className="flex items-center gap-2">
          <Wifi size={12} className="text-green-500" />
          <span>HI-FI CLOUD LINK</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-green-400">100%</span>
          <Battery size={12} className="text-green-400" />
        </div>
      </div>

      {/* 主要内容区域 - 相对定位容器 */}
      <div className="relative flex-1 w-full">
        
        {/* 中央垂直堆叠内容：封面 + 信息 + 进度 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pb-2">
          
          {/* 1. 专辑封面 */}
          <div className="relative group mb-3 shrink-0">
            {/* 背景发光层 */}
            <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.6)] border border-white/10 bg-black z-20 transition-transform duration-500 group-hover:scale-[1.02]">
              <img 
                src={song.albumArt} 
                alt="Album Art" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* 倒影 - 高度减小以避免干扰文字 */}
            <div 
              className="absolute top-full left-0 w-full h-8 pointer-events-none scale-y-[-1] opacity-30"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent, black)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
                zIndex: 10
              }}
            >
              <img src={song.albumArt} alt="" className="w-full h-28 object-cover rounded-xl blur-[1px]" />
            </div>
          </div>

          {/* 2. 歌曲信息 */}
          <div className="flex flex-col items-center justify-center w-3/4 text-center z-30 mb-2">
            <h2 className="text-sm font-bold leading-tight truncate w-full tracking-wide text-gray-100 drop-shadow-md">{song.title}</h2>
            <p className="text-[10px] text-green-500/80 font-medium truncate w-full uppercase tracking-[0.2em] mt-1">{song.artist}</p>
          </div>

          {/* 3. 进度条 */}
          <div className="w-2/3 max-w-[180px] px-1 z-30">
            <div className="flex justify-between text-[8px] opacity-30 mb-1 w-full font-mono tracking-tighter">
              <span>{formatTime(state.currentTime)}</span>
              <span>{formatTime(song.duration)}</span>
            </div>
            <div className="relative h-1 bg-white/10 w-full rounded-full overflow-visible group/progress cursor-pointer">
              <div 
                className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300 ease-linear shadow-[0_0_8px_#fff]"
                style={{ width: `${progressPercent}%` }}
              />
              {/* 进度球 */}
              <div 
                className="absolute -top-[2px] w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300 ease-linear opacity-0 group-hover/progress:opacity-100"
                style={{ left: `${progressPercent}%`, transform: 'translateX(-50%)' }}
              />
            </div>
          </div>
        </div>

        {/* 右侧歌词 - 绝对定位 */}
        <div className="absolute right-[-10px] top-0 bottom-0 w-24 flex flex-col items-end justify-center overflow-hidden z-10 pointer-events-none opacity-60">
          <div 
             className="transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) pr-4 text-right"
             style={{ transform: `translateY(${-(currentLyricIndex * 20) + 70}px)` }}
          >
            {(song.lyrics || []).map((l, idx) => (
              <p 
                key={idx} 
                className={`text-[8px] leading-5 transition-all duration-500 uppercase tracking-wider truncate w-24 ${idx === currentLyricIndex ? 'text-white opacity-100 font-bold' : 'opacity-10 text-white'}`}
              >
                {l.text}
              </p>
            ))}
          </div>
          {/* 侧边遮罩 */}
          <div className="absolute top-0 right-0 w-full h-16 bg-gradient-to-b from-[#121212] to-transparent z-20" />
          <div className="absolute bottom-0 right-0 w-full h-16 bg-gradient-to-t from-[#121212] to-transparent z-20" />
        </div>

      </div>

      {/* 底部系统参数 */}
      <div className="flex justify-between items-center text-[8px] opacity-30 mt-1 font-mono uppercase tracking-[0.2em] z-20 shrink-0">
        <div className="flex gap-4">
          <span>SRC: 24BIT/96KHZ</span>
        </div>
        <div className="flex gap-3 items-center">
          <span>TRK {trackIndex + 1}/25</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_#22c55e]" />
        </div>
      </div>
    </div>
  );
};

export default Display;
