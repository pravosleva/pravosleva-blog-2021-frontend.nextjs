export namespace NLooper {
  export type TResut = {
    start: (cb: () => void) => void;
    stop: () => void;
    getIsStated: () => boolean;
    getIsStopped: () => boolean;
  }
}

export const Looper = (ms: number = 3000): () => NLooper.TResut => {
  let timer: NodeJS.Timeout
  let wasStopped = false
  let wasStarted = false

  return () => {
    const start = (cb: () => void) => {
      console.log("--- Run")
      wasStarted = true
      wasStopped = false
      if (!wasStopped) {
        timer = setTimeout(function () {
          console.log("--- Looper done and will be restarted.")
          if (cb) cb()
          start(cb)
        }, ms)
      }
    }
    const stop = () => {
      wasStarted = false
      console.log("--- Looper stopped")
      wasStopped = true
      clearTimeout(timer)
    }
    return {
      start,
      stop,
      getIsStated: () => wasStarted,
      getIsStopped: () => wasStopped,
    }
  }
}

// NOTE: Usage
// const siMemLooper = Looper(10000)()
// siMemLooper.start(() => {
//   si.mem()
//     .then((data) => {
//       cpuStateInstance.set('mem', data)
//     })
//   si.diskLayout()
//     .then((data) => {
//       cpuStateInstance.set('diskLayout', data)
//     })
// })
