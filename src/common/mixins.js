import { each, isNumber, merge, mergeWith } from 'lodash'
// import { globalBus } from '@/common/bus.js'
// import moment from 'moment'
// import Api from '@/common/api.js'

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
      tableHeight: 500
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

  _dt_watches: {
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
