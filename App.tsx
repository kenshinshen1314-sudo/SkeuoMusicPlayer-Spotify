
import React, { useState, useEffect, useRef } from 'react';
import Display from './components/Display';
import Knob from './components/Knob';
import Controls from './components/Controls';
import { PlayerState, Song } from './types';

// Spotify Credentials
const CLIENT_ID = "58a9eb6095b0453f87bf723e34a41701";
const CLIENT_SECRET = "69d6a1f23e57461383c0808cf16b7b30";
const DEFAULT_PLAYLIST_ID = "44pNR0jS9OCkXrBLwVhox3";
const DEFAULT_PLAYLIST_NAME = "我的歌单";

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [selectorValue, setSelectorValue] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    volume: 70,
    isLiked: false,
    isHot: false,
    eqActive: false,
    fxActive: true,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        // 1. Get Access Token using Client Credentials Flow
        const authRes = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
          },
          body: 'grant_type=client_credentials'
        });
        
        if (!authRes.ok) throw new Error("Spotify Authorization Failed. Please check Client ID/Secret.");
        const authData = await authRes.json();
        const token = authData.access_token;

        // 2. Search for playlist "我的歌单"
        const playlistId = `${DEFAULT_PLAYLIST_ID}`;

        // 3. Fetch tracks from the playlist
        const tracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?market=CN&limit=50&offset=0`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        // https://api.spotify.com/v1/tracks?ids=5KGwux9a01daLHBnRgyLeb,1w1pcfR81HbvV3cbmnaRN1,5ddpH10Ny5OyegLCM1kInI&market=from_token


        const tracksData = await tracksRes.json();
        
        if (!tracksData.items || tracksData.items.length === 0) {
          throw new Error("Target playlist is empty or unavailable.");
        }

        // 4. Map tracks to our Song format.
        // NOTE: Spotify API often returns 'null' for preview_url due to licensing.
        // To ensure the player works as expected (real playback), we use a high-quality 
        // fallback source if the specific preview is unavailable, while keeping real metadata.
        const formattedSongs: Song[] = tracksData.items
          .filter((item: any) => item && item.track)
          .map((item: any, idx: number) => {
            const track = item.track;
            // Reliable fallback audio files (Creative Commons/Public Domain) to ensure the device actually "plays"
            // const fallbackAudio = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(idx % 16) + 1}.mp3`;
            // const fallbackAudio = `https://api.spotify.com/v1/albums/${track.id}`;
            
            //const fallbackAudio = track.album.external_urls.spotify;
            const fallbackAudio = "https://p.scdn.co/mp3-preview/2e9cd2df3110a4605a4204153025ff6fb561571f?cid=d8a5ed958d274c2e8ee717e6a4b0971d";
            const previewUrl = track.album.external_urls.spotify;
            const picSum = `https://picsum.photos/seed/${track.id}/300/300`;
            const trackId = track.id;

            return {
              id: track.id,
              title: track.name,
              artist: track.artists.map((a: any) => a.name).join(', '),
              albumArt: track.album.images[0]?.url || picSum,
              // audioUrl: track.preview_url || fallbackAudio,
              audioUrl: fallbackAudio,
              duration: track.duration_ms / 1000,
              lyrics: [
                { time: 0, text: '• SPOTIFY CLOUD FEED •' },
                { time: 5, text: `ALBUM: ${track.album.name}` },
                { time: 10, text: 'ENCRYPTED DATA STREAM...' },
                { time: 15, text: 'HI-FI BITSTREAM: OK' },
                { time: 20, text: 'DYNAMIC COMPRESSION: OFF' },
                { time: 25, text: 'LINK STRENGTH: 100%' },
              ]
            };
          })
          .slice(0, 25); // Limit to 25 to match the knob's discrete steps

        // add by kenshin 20251222
        const trackIds = formattedSongs.map(song => song.id).join(',');
        console.log('track ids:', trackIds);

        if (!trackIds) {
          throw new Error("Track ids is empty.");
        }

        const audioRes = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIds}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const audioData = await audioRes.json();

        console.log('audioData response:', audioData);

        if (!audioData.tracks || audioData.tracks.length === 0) {
          throw new Error("Target playlist is empty or unavailable.");
        }

        const formattedSongs2: Song[] = audioData.tracks
          .filter((track2: any) => track2 !== null)
          .map((track2: any, idx: number) => {
            const track = track2;
            // Reliable fallback audio files (Creative Commons/Public Domain) to ensure the device actually "plays"
            const fallbackAudio = "https://p.scdn.co/mp3-preview/2e9cd2df3110a4605a4204153025ff6fb561571f?cid=d8a5ed958d274c2e8ee717e6a4b0971d";
            const previewUrl = track.preview_url;
            const trackId = track.id;

            return {
              id: track.id,
              title: track.name,
              artist: track.artists.map((a: any) => a.name).join(', '),
              albumArt: track.album.images[0]?.url,
              audioUrl: previewUrl || fallbackAudio, 
              duration: track.duration_ms / 1000,
              lyrics: [
                { time: 0, text: '• SPOTIFY CLOUD FEED •' },
                { time: 5, text: `ALBUM: ${track.album.name}` },
                { time: 10, text: 'ENCRYPTED DATA STREAM...' },
                { time: 15, text: 'HI-FI BITSTREAM: OK' },
                { time: 20, text: 'DYNAMIC COMPRESSION: OFF' },
                { time: 25, text: 'LINK STRENGTH: 100%' },
              ]
            };
          })
          .slice(0, 25); // Limit to 25 to match the knob's discrete steps

        setSongs(formattedSongs2);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Spotify Integration Failure:", error);
        setErrorState(error.message || "Unknown Connection Error");
        setIsLoading(false);
      }
    };

    fetchSpotifyData();
  }, []);

  const currentSong = songs[currentSongIndex];

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume / 100;
    }
  }, [state.volume]);

  // Audio Playback Lifecycle
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (state.isPlaying) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay blocked or playback error:", err);
        setState(prev => ({ ...prev, isPlaying: false }));
      });
    } else {
      audioRef.current.pause();
    }
  }, [state.isPlaying, currentSongIndex, currentSong]);

  // Handle Knob Selector (Snaps value to track index)
  useEffect(() => {
    if (songs.length === 0) return;
    const stepCount = 25;
    const notch = Math.round((selectorValue / 100) * (stepCount - 1));
    const targetIndex = notch % songs.length;
    
    if (targetIndex !== currentSongIndex) {
      setCurrentSongIndex(targetIndex);
      setState(prev => ({ ...prev, currentTime: 0, isPlaying: true }));
    }
  }, [selectorValue, songs.length, currentSongIndex]);

  const togglePlayPause = () => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));

  const handleNext = () => {
    const step = 100 / 24;
    setSelectorValue(prev => (prev + step) % 100.1);
  };

  const handlePrev = () => {
    const step = 100 / 24;
    setSelectorValue(prev => (prev - step + 100) % 100.1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f0f0] text-black/40 font-mono text-[10px] tracking-[0.4em] uppercase animate-pulse">
        Initializing High-End Spotify Interface...
      </div>
    );
  }

  if (errorState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f0f0] text-red-600/80 font-mono text-[11px] tracking-[0.2em] uppercase p-10 text-center leading-loose">
        <div className="mb-4 text-3xl">⚠️ INTERFACE ERROR</div>
        Connection Logic Failure: {errorState}
        <br/>
        Please check provided Credentials.
        <button 
          onClick={() => window.location.reload()} 
          className="mt-10 border border-black/20 px-8 py-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          REBOOT SYSTEM
        </button>
      </div>
    );
  }

  /* Fixed the component structure and added the default export */
  return (
    <div className="flex flex-col items-center p-4">
      {/* Skeuomorphic Hardware Body */}
      <div className="w-[460px] bg-[#e0e0e0] rounded-[50px] p-8 shadow-[24px_24px_48px_#bebebe,-24px_-24px_48px_#ffffff] border-white/30 border-t border-l flex flex-col items-center">
        
        {/* LCD Screen Display */}
        {currentSong && <Display song={currentSong} state={state} trackIndex={currentSongIndex} />}

        {/* Knob Area */}
        <div className="flex justify-center w-full my-10">
          <Knob 
            value={selectorValue} 
            onChange={setSelectorValue}
            label="TRACK SELECTOR"
            subLabel="MY PLAYLIST SEARCH"
            steps={25}
          />
        </div>

        {/* Physical Push Buttons */}
        <Controls 
          onPlayPause={togglePlayPause}
          onPrev={handlePrev}
          onNext={handleNext}
          isLiked={state.isLiked}
          onToggleLike={() => setState(prev => ({ ...prev, isLiked: !prev.isLiked }))}
          isHot={state.isHot}
          onToggleHot={() => setState(prev => ({ ...prev, isHot: !prev.isHot }))}
          eqActive={state.eqActive}
          onToggleEq={() => setState(prev => ({ ...prev, eqActive: !prev.eqActive }))}
          fxActive={state.fxActive}
          onToggleFx={() => setState(prev => ({ ...prev, fxActive: !prev.fxActive }))}
        />

        {/* System Status LED */}
        <div className="mt-6 flex flex-col items-center gap-1.5">
          <div className="text-[10px] font-bold tracking-[0.4em] text-black/40">SYSTEM STATUS</div>
          <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] transition-colors duration-500 ${state.isPlaying ? 'bg-green-500 shadow-green-500' : 'bg-red-500 shadow-red-500'}`} />
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong?.audioUrl}
        onTimeUpdate={(e) => {
          const ct = e.currentTarget.currentTime;
          setState(prev => ({ ...prev, currentTime: ct }));
        }}
        onEnded={handleNext}
      />
    </div>
  );
};

export default App;
