import { ref, computed, reactive } from 'vue'
import KaraokeVideo from './components/KaraokeVideo.js'

const videos = [
  "https://www.youtube.com/watch?v=qELxGX4VJH8",
  "https://www.youtube.com/watch?v=aUvfcpv0c-k",
  "https://www.youtube.com/watch?v=40FK8d0d-Zg",
  "https://www.youtube.com/watch?v=QvZ7YP2s1Uo",
  "https://www.youtube.com/watch?v=DdCvEKkCKiw",
  "https://www.youtube.com/watch?v=HsVPw6Bf_nw",
  "https://www.youtube.com/watch?v=dY6oJ5_GrL4",
  "https://www.youtube.com/watch?v=nJA6GxaKI90",
  "https://www.youtube.com/watch?v=suIxvhWSq3U",
  "https://www.youtube.com/watch?v=fKNguSQaBxc",
  "https://www.youtube.com/watch?v=FNBhgHZ3KgA",
  "https://www.youtube.com/watch?v=CeftiOC4YDk",
  "https://www.youtube.com/watch?v=keejy6-6xt4",
  "https://www.youtube.com/watch?v=V9Po6JEHepY",
  "https://www.youtube.com/watch?v=Nc5Y5WKUH40",
  "https://www.youtube.com/watch?v=VxUr-LbVsY0",
  "https://www.youtube.com/watch?v=5PA6VEDIicM",
  "https://www.youtube.com/watch?v=VtQJ6byukTU",
  "https://youtu.be/QNVtVvAJhDI?si=Fx9vH53408CwnWwU",
  "https://youtu.be/r8BdFXaYE8s?si=HzL_q0XvkQkogGFu",
  "https://youtu.be/bC4ER15Hj10?si=8so7ysN4sxcjPPyd",
  "https://www.youtube.com/watch?v=7_iw-ZMq9SE",
  "https://www.youtube.com/watch?v=av7qVo2OueE&rco=1",
  "https://www.youtube.com/watch?v=gy8PRY6SmZA",
  "https://www.youtube.com/watch?v=kMmPV8sv90s",
  "https://www.youtube.com/watch?v=iHSYklghNCQ",
  "https://www.youtube.com/watch?v=c5BjapvUndQ",
  "https://www.youtube.com/watch?v=FNIhj6DQtgk",
  "https://www.youtube.com/watch?v=7zpBQlkqiWM",
  "https://www.youtube.com/watch?v=l8Fk9lHid0w",
  "https://www.youtube.com/watch?v=lXTRCeadTfo",
]

function extractVideoId(video_url) {
    const parsed_url = new URL(video_url)
    if (parsed_url.hostname === 'youtube.com' || parsed_url.hostname === 'www.youtube.com') {
        return parsed_url.searchParams.get('v')
    } else if (parsed_url.hostname === 'youtu.be') {
        return parsed_url.pathname.substring(1)
    }
}

export default {
  components: { KaraokeVideo },
  template: await fetch('./templates/app.html').then(response => response.text()),
  setup() {
    const selectedVideo = ref('')

    function onSelect({id}) {
      selectedVideo.value = id
    }

    function updateTitle({title}) {
      clips[selectedVideo.value].title = title
      const video_data_id = videos_data.value.find(video => video.value === selectedVideo.value)
      video_data_id.title = title
    }

    function updateStart({seconds}) {
      clips[selectedVideo.value].start = seconds
      console.log(clips[selectedVideo.value].start)
    }

    function updateEnd({seconds}) {
      clips[selectedVideo.value].end = seconds
    }

    function openAppendVideoDialog() {
      const url = prompt('Insert new youtube url', null)
      if (url === null) {
        return
      }
      const videoId = extractVideoId(url)
      videos_data.value.push({title: url, value: videoId})
      clips[videoId] = {title: '', start: 0, end: 1, videoId}
    }

    function downloadClipsList() {
      const blob = new Blob([JSON.stringify(clips)], {
        type: "application/json",
      });
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
    
      link.href = url
      link.download = 'karaoke_clips.json'
      document.body.appendChild(link)
      link.click()
    
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }

    const videos_data = ref(videos.map(videoUrl => ({title: videoUrl, value: extractVideoId(videoUrl)})))
    const clips = reactive(Object.fromEntries(
      videos.map(videoUrl => [extractVideoId(videoUrl), {title: '', start: 0, end: 1, videoId: extractVideoId(videoUrl)}])
    ))

    const currentClip = computed(() => clips[selectedVideo.value])

    return {
      selectedVideo,
      videos: videos_data,
      onSelect,
      clips,
      updateTitle,
      updateStart,
      updateEnd,
      currentClip,
      openAppendVideoDialog,
      downloadClipsList,
    }
  }
}