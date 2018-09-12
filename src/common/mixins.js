import { each, isNumber, merge, mergeWith } from 'lodash'
import { globalBus } from '@/common/bus.js'
import moment from 'moment'
import Api from '@/common/api.js'

const orderMap = {
  descending: 'DESC',
  ascending: 'ASC'
}

// 计算容器高度模块
export const domHeightMixin = {
  methods: {
    // 初始化body高度
    initBody(subtracts = []) {
      this.bodyHeight = this._subtractOperate(subtracts)
    },

    // 计算表格高度
    initTableHeight(subtracts = []) {
      this.tableHeight = this._subtractOperate(subtracts) - 2 // -2 修复边框被盖住的细节问题
    },

    // 计算高度
    _subtractOperate(subtracts = []) {
      let height = window.innerHeight - 68 - 15 * 2 // 68 is headnav menu margin-top 15 is body padding
      subtracts.forEach(v => {
        if (isNumber(v)) {
          height -= v
        } else if (v instanceof HTMLElement) {
          const vRect = v.getBoundingClientRect()
          height -= vRect.height
        }
      })
      return height
    }
  },

  data() {
    return {
      bodyHeight: window.innerHeight,
      tableHeight: 500,
      afterDateDisabled: {
        //设置今天之后的日期不可点击
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      beforeDateDisabled: {
        //设置今天之前的日期不可点击
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  }
}

// 计算元素便宜量
export const domOffset = {
  data() {
    return {
      offsetX: '',
      offsetY: ''
    }
  },
  methods: {
    // 计算偏量
    _offset(subtract) {
      if (typeof subtract === 'string') {
        var element = document.querySelectorAll(subtract)[0]
        this.offsetX = element.getBoundingClientRect().x
        this.offsetY = element.getBoundingClientRect().y
      } else if (subtract instanceof Object) {
        this.offsetX = subtract.getBoundingClientRect().x
        this.offsetY = subtract.getBoundingClientRect().y
      }
    }
  }
}

// 表格通用模块
export const tableListMixin = {
  methods: {
    clearFilter() {
      each(this.filter, (v, k) => {
        if (k !== 'pageSize' && k !== 'pageNumber') {
          this.filter[k] = ''
        }
      })
      this.search()
    },

    search(savedPage, ignores = []) {
      if (!savedPage) this.filter.pageNumber = 1 // 重置到第一个页面
      // keys(this.filter).forEach(k => {
      //   if (ignores.includes(k)) delete this.filter[k]
      // })

      this.filter = merge(this.filter, { refresh: Math.random() })
      this.$router.push({
        name: this.$route.name,
        query: this.pruneParams(this.filter)
      })
    },

    pageChange(val) {
      this.filter.pageNumber = val
      this.search(true)
    },

    pageSizeChange(val) {
      this.filter.pageSize = val
      this.search(true)
    },

    // 排序
    sortChange({ column, prop, order }) {
      this.filter.sortBy = prop
      this.filter.sort = order ? orderMap[order] : ''
      this.search(true)
    },

    // 机构点击
    orgNodeClick([item = {}]) {
      this.activeOrg = item
      this.filter.organId = item.id || ''
      this.search()
    },

    handleCurrentChange(row) {
      this.currentRow = row
    },

    tableRowIndex(index) {
      return (this.filter.pageNumber - 1) * this.filter.pageSize + index + 1
    }
  },

  created() {
    mergeWith(this.filter, this.$route.query, (objValue, srcValue) => {
      if (!isNaN(srcValue)) {
        return Number(srcValue)
      }
      return srcValue
    })
  },

  _bd_watches: {
    tableHeight() {
      this.$nextTick(() => {
        const pagenav = this.$refs.pagenav.getBoundingClientRect()
        this.$refs.table.layout.setHeight(this.tableHeight - pagenav.height)
      })
    },
    $route: {
      immediate: true,
      handler() {
        this._fetchData()
      }
    }
  },

  data() {
    return {
      activeOrg: null,
      page: {
        total: 0,
        sizes: [8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 50, 100, 200]
      },
      maxHeight: 6000
    }
  }
}

// 卡片式列表通用mixin
export const cardListMixin = {
  methods: {
    _initCardColumn(container, subtracts, minWidth) {
      const contentRect = container.getBoundingClientRect()
      let containerValidWidth = contentRect.width
      subtracts.forEach(v => {
        if (isNumber(v)) {
          containerValidWidth -= v
        } else if (v instanceof HTMLElement) {
          const vRect = v.getBoundingClientRect()
          containerValidWidth -= vRect.width
        }
      })

      this.columnCount = Math.min((containerValidWidth / minWidth) | 0, 24) // 240 is grid-content card min-width
      this.elColSpan = (24 / this.columnCount) | 0
      this.filter && (this.filter.pageSize = this.columnCount * 4)
      console.log('columnCount update to ', this.columnCount)
      console.log(this.elColSpan)
    }
  },

  computed: {
    colOffset() {
      return 0
      // return (24 - this.columnCount * this.elColSpan) / 2 | 0 // 24 is element-ui total col counts
    }
  },

  data() {
    return {
      columnCount: 6,
      elColSpan: 4
    }
  }
}

// video mixin
export const videoMixin = {
  resizeListener: null,
  methods: {
    onMounted(bdVideo) {
      if (this.resizeListener) return
      this.resizeListener = () => {
        if (bdVideo.isMax) {
          bdVideo._initViewSize()
        }
      }
      globalBus.$on('window-resize', this.resizeListener)
      console.log('on resizeListener')
    },

    onDesdroy() {
      globalBus.$off(this.resizeListener)
      console.log('off resizeListener')
    },

    async _getVideoUrl(device) {
      // return 'http://192.168.193.45:8080/live/0/main/av_stream_face.flv'
      const rtspUrl = await Api.deviceRtspUrl
        .get(
          {},
          {
            pathParams: {
              id: device.stdId
            }
          }
        )
        .then(res => res.data.result)

      const data = await Api.videoUrl
        .get({
          deviceId: device.stdId,
          rtspUrl: rtspUrl
        })
        .then(res => res.data)
      return data.result || ''
    },

    getRatio(width, height) {
      const whRatio = 9 / 16
      let vw = width
      let vh = (width * whRatio) | 0

      if (vh > height) {
        vh = height
        vw = (height / whRatio) | 0
      }
      return { vw, vh }
    }
  },

  data() {
    return {
      video: {
        visible: false,
        url: ''
        // url: 'http://10.31.143.53:8000/live/av_stream.flv'
      }
    }
  }
}

// export const imgWidth = {
//   methods: {
//     getNaturalWidth(src) {
//       var image = new Image()
//       image.src = src
//       var naturalWidth = image.width
//       var natureHeight = image.height
//       return naturalWidth / natureHeight
//     }
//   }
// }

export const personAndCarDialogMinxin = {
  methods: {
    pageSizeChange1(val) {
      this.filter1.pageSize = val
      this.search1(true)
    },
    pageChange1(val) {
      this.filter1.pageNumber = val
      this.search1(true)
    },
    search1(savedPage) {
      if (!savedPage) this.filter1.pageNumber = 1 // 重置到第一个页面
      this.filter1 = merge(this.filter1, { refresh: Math.random() })
      this._getTraceData()
    },
    _getTracePoints(traceData) {
      return traceData.map(v => {
        return {
          infoWindow: {
            title: moment(v.createTime).format('YYYY-MM-DD HH:mm:ss'),
            content: v.address,
            capture: v.imageUrl
          },
          name: v.name,
          stdId: v.deviceId,
          animation: '',
          position: {
            lng: v.longitude,
            lat: v.latitude
          }
        }
      })
    },
    //点击对话框的取消按钮关闭对话框
    _closeWindow() {
      this.activeNames = 'first'
      this.$emit('closeWindow', false)
    }
  },
  data() {
    return {
      page1: {
        total: 0,
        sizes: [10, 12, 16, 20, 24, 28, 32, 36, 40, 50, 100, 200]
      }
    }
  }
}
