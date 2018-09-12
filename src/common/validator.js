import { get, keys, isNil, every } from 'lodash'

import { isIdcard } from '@/common/util.js'
import i18n from '@/i18n'

//验证字符串是否为空串，去掉前后有空格
export function validateBlackSpace(rule, value, cb) {
  if (
    value &&
    value.length !== 0 &&
    value.replace(/(^\s*)|(\s*$)/g, '').length === 0
  ) {
    cb(
      new Error(
        rule.message ||
          i18n.t('global.validator.validateBlackSpace', {
            name: rule.filedName
          })
      )
    )
  } else {
    cb()
  }
}

//验证字符串中是否有空格
export function validateCenterBS(rule, value, cb) {
  var centerStr = value && value.replace(/\s/g, '') //去掉中间空格
  var leftStr = value && value.replace(/^\s*/g, '') //去掉左边空格
  var rightStr = value && value.replace(/\s*$/g, '') //去掉右边空格
  if (
    value &&
    (value.length > centerStr.length ||
      value.length > leftStr.length ||
      value.length > rightStr.length)
  ) {
    cb(
      new Error(
        rule.message ||
          i18n.t('global.validator.validateCenterBS', { name: rule.filedName })
      )
    )
  } else {
    cb()
  }
}

// 校验身份证好不能小于15位不能大于18位
export function validateLength(rule, value, cb) {
  if (value && (value.length > 18 || value.length < 15)) {
    cb(
      new Error(
        rule.message ||
          i18n.t(global.validator.validateLength, { name: rule.fileName })
      )
    )
  } else {
    cb()
  }
}

// 简单校验数组是否为空
export function validateArray(rule, value, cb) {
  if (!value || !value.length) {
    cb(
      new Error(
        rule.message ||
          i18n.t('global.validator.validateArray', { name: rule.filedName })
      )
    )
  } else {
    cb()
  }
}

// 校验数组的每一个对象
export function validateArrayDeep(rule, value, cb) {
  if (!value || !value.length) {
    cb(
      new Error(
        rule.message ||
          i18n.t('global.validator.validateArrayDeep', { name: rule.filedName })
      )
    )
  } else {
    const valid = every(value, item => {
      return every(keys(item), k => {
        if (rule.arrayKeys[k] && rule.arrayKeys[k].required && !item[k]) {
          item.hasError = true
          cb(new Error(`${rule.arrayKeys[k].message}`))
          return false
        }
        item.hasError = false
        return true
      })
    })

    if (valid) {
      cb()
    }
  }
}

// 校验对象中的每一个值
export function validateObject(rule, value, cb) {
  if (!value) {
    cb(
      new Error(
        rule.message ||
          i18n.t('global.validator.validateObject', { name: rule.filedName })
      )
    )
  }
  const valid = every(keys(value), k => {
    const item = rule.validateKeys[k]
    if (item && item.required && isNil(value[k])) {
      cb(new Error(`${item.message}`))
      return false
    }
    return true
  })

  if (valid) {
    cb()
  }
}

export function validateEqual(rule, value, cb) {
  if (value !== get(this, rule.compare)) {
    cb(
      new Error(
        i18n.t('global.validator.validateEqual', { name: rule.compareName })
      )
    )
  } else {
    cb()
  }
}

export function validateIdCard(rule, value, cb) {
  if (!value || !isIdcard(value)) {
    cb(new Error(i18n.t('global.validator.validateIdCard')))
  } else {
    cb()
  }
}
