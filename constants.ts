
import { Song } from './types';

export const SONGS: Song[] = [
  {
    id: '1',
    title: 'At Peace',
    artist: 'Karan Aujla',
    albumArt: 'https://picsum.photos/seed/music1/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 164,
    lyrics: [
      { time: 0, text: 'Pakki aa jabaan,' },
      { time: 5, text: 'jeebh kare na slip' },
      { time: 10, text: 'Kurta ae kaala,' },
      { time: 15, text: 'beeba yaaran di drip' },
      { time: 20, text: 'Yatch \'te Amalfi si' },
      { time: 25, text: 'chali sip-sip' },
      { time: 30, text: 'Saala quarter milli \'ch' },
      { time: 35, text: 'munda kare na trip' },
    ]
  },
  {
    id: '2',
    title: 'Midnight City',
    artist: 'M83',
    albumArt: 'https://picsum.photos/seed/music2/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 180,
    lyrics: [
      { time: 0, text: 'Waiting in a car' },
      { time: 4, text: 'Waiting for a ride in the dark' },
      { time: 8, text: 'The night city grows' },
      { time: 12, text: 'Look and see her eyes, they glow' },
      { time: 16, text: 'Waiting in a car' },
      { time: 20, text: 'Waiting for a ride in the dark' },
    ]
  },
  {
    id: '3',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    albumArt: 'https://picsum.photos/seed/music3/300/300',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 200,
    lyrics: [
      { time: 0, text: 'I\'ve been on my own for long enough' },
      { time: 5, text: 'Maybe you can show me how to love' },
      { time: 10, text: 'I\'m going through withdrawals' },
      { time: 15, text: 'You don\'t even have to do too much' },
      { time: 20, text: 'You can turn me on with just a touch' },
    ]
  }
];

export const SAMPLE_SONG = SONGS[0];
