import { searchEngine } from '~/store/reactive-engine/articles-search/searchEngine'
import { AudioPodcastService, IAudioTrack } from '~/store/reactive-engine/audio-podcast'
import { useReactiveValue0 } from '~/utils/reactive-engine'

export const useAudioPodcast = () => {
  const audioPodcastService = searchEngine.inject(AudioPodcastService)

  const queue = useReactiveValue0<IAudioTrack[]>(audioPodcastService.queue)
  const currentTrack = useReactiveValue0<IAudioTrack | null>(audioPodcastService.currentTrack)
  const isPlayerVisible = useReactiveValue0<boolean>(audioPodcastService.isPlayerVisible)
  const isPlayerMinimized = useReactiveValue0<boolean>(audioPodcastService.isPlayerMinimized)
  const trackErrors = useReactiveValue0<Record<string, boolean>>(audioPodcastService.trackErrors)

  return {
    queue,
    currentTrack,
    isPlayerVisible,
    isPlayerMinimized,
    trackErrors,
    addToQueue: (track: IAudioTrack) => audioPodcastService.addToQueue(track),
    removeFromQueue: (trackId: string) => audioPodcastService.removeFromQueue(trackId),
    playTrack: (track: IAudioTrack) => audioPodcastService.playTrack(track),
    markTrackAsBroken: (trackId: string) => audioPodcastService.markTrackAsBroken(trackId),
    setPlayerVisible: (visible: boolean) => audioPodcastService.isPlayerVisible.value = visible,
    setPlayerMinimized: (minimized: boolean) => audioPodcastService.isPlayerMinimized.value = minimized,
    saveTrackProgress: (trackId: string, time: number) => audioPodcastService.saveTrackProgress(trackId, time),
    getTrackProgress: (trackId: string) => audioPodcastService.getTrackProgress(trackId)
  }
}
