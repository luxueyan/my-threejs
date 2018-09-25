import { isNumber, round, isNil, isArray, isNaN, keys, keyBy } from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
// import store from '@/vuex/store.js'

const enums = require.context('../views', true, /enum\.js$/)
const filterList = []

export default {
  install(Vue) {
    enums.keys().forEach(v => {
      const enumObj = enums(v)
      keys(enumObj).forEach(k => {
        if (Vue.prototype[k]) throw new Error(`${k}的enum名称重复`)
        if (filterList.find(v => v === JSON.stringify(enumObj[k]))) {
          throw new Error(`${JSON.stringify(enumObj[k])}:${k}的enum列表重复`)
        }
        filterList.push(JSON.stringify(enumObj[k]))
        Vue.prototype[k] = enumObj[k]
        Vue.prototype[k.replace('List', 'Map')] = keyBy(enumObj[k], 'value')
        Vue.filter(k.replace('List', 'Format'), value => {
          const target = Vue.prototype[k.replace('List', 'Map')][value]
          return target ? target.name : ''
        })
      })
    })

    Vue.filter('parseInt', parseInt)

    Vue.filter('dtJoin', (value, keyBy) => {
      if (isArray(value)) {
        value.map(v => v[keyBy]).join(',')
      }
      return '-'
    })

    Vue.filter('dtCurrency', (value, prefix = '￥', suffix = '') => {
      if (!isNil(value) && !isNaN(value)) {
        return prefix + numeral(round(value, 2)).format('0,0.00') + suffix
      }
      return isNil(value) || isNaN(value) ? '-' : value
    })

    Vue.filter('dtThousand', (value, suffix = '万元') => {
      if (isNumber(value)) {
        return numeral(value / 10000).format('0,0.00') + suffix
      }
      return value || '-'
    })

    Vue.filter('dtHM', (value, suffix = '亿元') => {
      if (Number(value)) {
        return numeral(value / 100000000).format('0,0.00') + suffix
      }
      return isNil(value) ? '-' : value
    })

    Vue.filter('dtKm', (value, kmValue = '公里') => {
      if (isNumber(value)) {
        if (value < 1000) return round(value) + '米'
        else return numeral(round(value / 1000)).format('0,0') + kmValue
      }
      return value || '-'
    })

    Vue.filter('dtPercent', (value, decimal = 2, multi = 100, unit = '%') => {
      if (!isNil(value) && !isNaN(value)) {
        return round(value * multi, decimal).toFixed(decimal) + (unit || '')
      }
      return isNil(value) || isNaN(value) ? '-' : value
    })

    Vue.filter('dtRangePercent', (value, value2, decimal = 2) => {
      value = isNumber(value) ? round(value, decimal).toFixed(decimal) : ''
      value2 = isNumber(value2) ? round(value2, decimal).toFixed(decimal) : ''
      if (value === value2) {
        return value + '%'
      }

      return `${value}-${value2}%`
    })

    Vue.filter('dtRound', (value, decimal = 0) => {
      return round(value, decimal).toFixed(2)
    })

    Vue.filter('dtAppend', (value, str) => {
      return (isNil(value) ? '' : value) + str
    })

    Vue.filter('dtPrepend', (value, str) => {
      return str + (isNil(value) ? '' : value)
    })

    Vue.filter('dtPositveNumber', value => {
      if (value > 0 && isNumber(value)) {
        return '+' + value
      }
      return value
    })

    Vue.filter('dtNegativeNumber', value => {
      if (value > 0) {
        return value
      } else {
        return -value
      }
    })

    Vue.filter('dtNull', (value, str) => {
      return isNil(value) ? '-' : str || value || '-'
    })

    Vue.filter('dtTime', value => {
      if (isNumber(value)) {
        const minute = Math.floor(value / 1000 / 60)
        if (minute > 60) {
          const hour = Math.floor(minute / 60)
          if (hour > 24) {
            const day = Math.floor(hour / 24)
            return day + '天' + (hour - day * 24) + '小时' + (minute - hour * 60) + '分钟'
          }
          return hour + '小时' + (minute - hour * 60) + '分钟'
        }
        return minute + '分钟'
      }
      return value
    })

    Vue.filter('moment', (date, format = 'YYYY-MM-DD', inputFormat = '') => {
      if (inputFormat) {
        return date ? moment(date, inputFormat).format(format) : '-'
      }
      return date ? moment(date).format(format) : '-'
    })
  }
}
