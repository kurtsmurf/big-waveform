const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth - 64
canvas.height = 256;
canvas.style.border = '4px solid #0DBC79'

const w = canvas.width
const h = canvas.height
const res = 10

const ctx = canvas.getContext('2d')
ctx.fillStyle = '#0DBC79'

const audioContext = new AudioContext()

const rms = (arr) => {
  const sum = arr
  .map(x => Math.abs(x))
  .reduce((prev,curr) => prev + curr, 0)
  return sum / arr.length
}

const normalize = (arr) => {
  const max = arr
  .map(x => Math.abs(x))
  .reduce((prev, curr) => Math.max(prev,curr), 0)
  
  return arr.map(x => x * (1/max))
}

let sndwav
const draw = (audioBuffer, offset = 100) => {
  const left = normalize(Array.from(audioBuffer.getChannelData(0)))

  for (x=0;x<w;x++) {
    const start = (x + offset) * res
    const end = start + res
    const avgAmp = rms(left.slice(start, end))
    const amplitude = avgAmp * h

    ctx.fillRect(x,(h-amplitude)/2,1,amplitude)
  }
}

let offset = 100
const animate = () => {
  ctx.clearRect(0,0,w,h)
  draw(sndwav, offset)
  
  offset = offset * res > sndwav.length ? 0 : offset + 10
  requestAnimationFrame(animate)
}

fetch('snd.wav')
.then(response => response.arrayBuffer())
.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
.then(audioBuffer => sndwav = audioBuffer)
.then(animate)
