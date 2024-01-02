// NOTE: https://github.com/liriliri/eruda

class CustomErudaSingletone {
  constructor({ document }) {
    this.isEnabled = false
    this.document = document
  }
  static getInstance(arg) {
    if (!CustomErudaSingletone.instance) CustomErudaSingletone.instance = new CustomErudaSingletone(arg)

    return CustomErudaSingletone.instance
  }
  initIfNecessary() {
    if (this.isEnabled) return

    const src = '/static/common/eruda@2.10.0.min.js'
    const script = this.document.createElement('script')
    script.src = src

    this.document.body.appendChild(script)
    script.onload = function () {
      eruda.init()
      // eruda.position({ x: 20, y: 20 })
    }
    script.onerror = function(err) {
      console.log(err)
    }

    this.isEnabled = true
  }
}

const customEruda = CustomErudaSingletone.getInstance({
  document: window.document,
})

// customEruda.initIfNecessary()
