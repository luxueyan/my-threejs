import {
  cloneDeep,
  isNull,
  every,
  each,
  isPlainObject,
  isObject
} from 'lodash'
import moment from 'moment'

export function urlMatcher(url, params = {}) {
  return url.replace(/\/:([^/]+)/g, (match, g1) => {
    return params[g1] ? '/' + params[g1] : ''
  })
}

// 清理无用参数
export function pruneParams(params, visible) {
  var newParams = cloneDeep(params)
  each(newParams, (v, i) => {
    if (
      newParams[i] === '' ||
      isNull(newParams[i]) ||
      newParams[i] === '_all_' ||
      (isPlainObject(visible) && visible[i] === false)
    ) {
      delete newParams[i]
    }
  })
  return newParams
}

// 随机数
export function randomCode() {
  return (
    (+new Date()).toString(32) +
    '-' +
    Math.random()
      .toString(32)
      .slice(2)
  )
}

// 压缩图片并转为jpeg
export function convert2JPEG(img, isCompress = false) {
  // 图片质量 待确认? 120x120
  const canvas = document.createElement('canvas')
  if (isCompress) {
    canvas.width = 200
    canvas.height = 200 * (img.height / img.width)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  } else {
    canvas.width = Math.min(img.width, 2500)
    canvas.height = (canvas.width * img.height) / img.width
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
  return canvas.toDataURL('image/jpeg', 0.9)
}

// 获取图片base64
export function getBase64(fileBlob, isCompress = false) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.addEventListener('load', () => {
      if (!isCompress) {
        resolve(fr.result)
      } else {
        const img = new Image()
        img.onload = () => {
          resolve(this.convert2JPEG(img, isCompress))
        }
        img.onerror = err => {
          resolve(err)
        }
        img.src = fr.result
      }
    })

    fr.addEventListener('error', () => {
      reject(fr.error)
    })

    fr.readAsDataURL(fileBlob)
  })
}

// 获取base64位图片的宽高比
export function getNaturalWidth(src) {
  var image = new Image()
  image.src = src
  var naturalWidth = image.width
  var natureHeight = image.height
  return naturalWidth / natureHeight
}

// 补齐元素
export function padDataTo(data = [], number = 0) {
  if (!data.length) return data

  every(Array(number).fill(0), () => {
    if (data.length % number === 0) {
      return false
    }
    data.push({ _placeholder: true })
    return true
  })
  return data
}

// 日期到 23:59:59秒
export function ceilDate(date) {
  return date
    ? +moment(moment(date).format('YYYY-MM-DD')).toDate() + 86400000 - 1000
    : ''
}

// 日期到 00:00:00秒
export function floorDate(date) {
  return date ? +moment(moment(date).format('YYYY-MM-DD')).toDate() : ''
}

//取得字符串真实长度
export function getStringTrueLength(str) {
  return String(str).replace(/[^\x00-\xff]/g, 'xx').length // eslint-disable-line
}

//验证字符串是否是二代18位身份证
export function isIdcard(value) {
  if (value === null || value === '') {
    return false
  }
  if (getStringTrueLength(value) !== 18) {
    return false
  }

  const jqyz = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const vcode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  let jssum = 0
  for (let i = 0; i < getStringTrueLength(value) - 1; i++) {
    jssum += Number(value[i]) * jqyz[i]
  }

  return value[17] === vcode[jssum % 11]
}

// 预加载图片
export function preloadImages(images = []) {
  if (isObject(images)) images = [images]
  return Promise.all(
    images.map(v => {
      return new Promise(resolve => {
        const img = new Image()
        img.onload = () => {
          resolve({ ok: true, img: img, ...v })
        }

        img.onerror = () => {
          resolve({ ok: false, img: img, ...v })
        }
        img.src = v.url
      })
    })
  )
}

// 连续的数组去重
export function arrayDeRepeat(arr = [], byKey = '') {
  return arr.reduce((prunedArr, currentVal) => {
    if (!prunedArr.length) {
      prunedArr.push(currentVal)
    } else if (!byKey && prunedArr[prunedArr.length - 1] !== currentVal) {
      prunedArr.push(currentVal)
    } else if (
      byKey &&
      prunedArr[prunedArr.length - 1][byKey] !== currentVal[byKey]
    ) {
      prunedArr.push(currentVal)
    }
    return prunedArr
  }, [])
}
