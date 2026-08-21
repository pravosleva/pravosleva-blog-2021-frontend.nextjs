import { searchEngine } from '~/store/reactive-engine/articles-search/searchEngine'
import { AudioPodcastService, IAudioTrack, AdvancedAudioPodcastService } from '~/store/reactive-engine/audio-podcast'
import { useReactiveValue0 } from '~/utils/reactive-engine'

export const useAudioPodcast = () => {
  // const audioPodcastService = searchEngine.inject(AudioPodcastService)
  const audioPodcastService = searchEngine.inject(AdvancedAudioPodcastService)

  const queue = useReactiveValue0<IAudioTrack[]>(audioPodcastService.queue)
  const currentTrack = useReactiveValue0<IAudioTrack | null>(audioPodcastService.currentTrack)
  const isPlayerVisible = useReactiveValue0<boolean>(audioPodcastService.isPlayerVisible)
  const isPlayerMinimized = useReactiveValue0<boolean>(audioPodcastService.isPlayerMinimized)
  const trackErrors = useReactiveValue0<Record<string, boolean>>(audioPodcastService.trackErrors)
  // const playTrigger = useReactiveValue0<number>(audioPodcastService.playTrigger)
  const isPlaying = useReactiveValue0<boolean>(audioPodcastService.isPlaying)
  const currentTime = useReactiveValue0<number>(audioPodcastService.currentTime)
  const duration = useReactiveValue0<number>(audioPodcastService.duration)
  
  return {
    queue,
    currentTrack,
    isPlayerVisible,
    isPlayerMinimized,
    trackErrors,
    // playTrigger,
    isPlaying,
    currentTime,
    duration,
    toggleTrack: (track: IAudioTrack) => audioPodcastService.toggleTrack(track), // ИСПРАВЛЕНО
    addToQueue: (track: IAudioTrack) => audioPodcastService.addToQueue(track),
    removeFromQueue: (trackId: string) => audioPodcastService.removeFromQueue(trackId),
    // playTrack: (track: IAudioTrack) => audioPodcastService.playTrack(track),
    markTrackAsBroken: (trackId: string) => audioPodcastService.markTrackAsBroken(trackId),
    setPlayerVisible: (visible: boolean) => audioPodcastService.isPlayerVisible.value = visible,
    setPlayerMinimized: (minimized: boolean) => audioPodcastService.isPlayerMinimized.value = minimized,
    setIsPlaying: (playing: boolean) => audioPodcastService.isPlaying.value = playing, // Изменение стейта плеера
    saveTrackProgress: (trackId: string, time: number) => audioPodcastService.saveTrackProgress(trackId, time),
    getTrackProgress: (trackId: string) => audioPodcastService.getTrackProgress(trackId),
    registerAudioElement: (el: HTMLAudioElement | null) => audioPodcastService.registerAudioElement(el),
    setDurationValue: (v: number) => audioPodcastService.duration.value = v,
    stopTrack: () => audioPodcastService.stopTrack(),
    playNextTrack: () => audioPodcastService.playNextTrack(),
    getAnalyser: () => audioPodcastService.getAnalyser(),
    seekForward: () => audioPodcastService.seekRelative(20),
    seekBackward: () => audioPodcastService.seekRelative(-20),
  }
}
