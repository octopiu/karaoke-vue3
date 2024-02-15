import { ref, computed, toRef, watch, onMounted, reactive } from 'vue'

let player = null

export default {
  name: 'KaraokeVideo',
  template: await fetch('../../templates/video.html').then(response => response.text()),
  props: {
    clip: {
      type: Object,
      default () {
        return {title: '', start: 0, end: 1, video_id: ''}
      }
    }
  },
  setup(props, { emit }) {
    onMounted(() => {
      window.YT.ready(() => {
        console.log('youtube loaded')
        player = new YT.Player('player', {
          height: '576',
          width: '1024',
          autoplay: false,
        })
      })
    })
    const clip = toRef(props, 'clip') 
    const clipStart = ref(0)
    const clipEnd = ref(1)
    const videoLength = ref(1)

    function setStart () {
      clipStart.value = Math.floor(player.getCurrentTime())
      emit('start-update', { seconds: clipStart.value })
    }
    function setEnd () {
      clipEnd.value = Math.ceil(player.getCurrentTime())
      emit('end-update', { seconds: clipEnd.value })
    }
    function onStateChange() {
      if (player !== null) {
        videoLength.value = player.getDuration()
        emit('title-update', { title: player.getVideoData().title })
        console.log(player.getDuration())
      }
    }
    watch(clip, (newClip, oldClip) => {
      if (player !== null) {
        console.log(newClip)
        clipStart.value = newClip.start
        clipEnd.value = newClip.end
        player.loadVideoById(newClip.videoId)
        player.addEventListener('onStateChange', onStateChange)
      }
    })
    function save() {
      emit('start-update', { seconds: clipStart.value})
      emit('end-update', { seconds: clipEnd.value})
    }
    return {
      videoLength,
      clipStart,
      clipEnd,
      setStart,
      setEnd,
      clip,
      save,
    }
  }
}