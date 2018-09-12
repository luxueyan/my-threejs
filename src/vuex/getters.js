export default {
  // authorities(state) {
  //   return state.user.authorities ? state.user.authorities.map(v => v.authority) : []
  // },
  // getDictList(state) {
  //   return dictTypeId => {
  //     return state.dictList.filter(v => v.dictTypeId === dictTypeId)
  //   }
  // },
  // getLibaryList(state) {
  //   return libaryType => {
  //     if (libaryType !== 0 && !libaryType) return state.libaryList
  //     return state.libaryList.filter(v => v.type === libaryType)
  //   }
  // },
  // getNativeName(state) {
  //   return nativePlace => {
  //     if (!nativePlace) {
  //       return
  //     } else if (typeof nativePlace === 'string') {
  //       nativePlace = nativePlace.split(',')
  //     }
  //     const province = state.nativeList.find(
  //       v => v.codeID === parseInt(nativePlace[0])
  //     )
  //     let resStr = ''
  //     if (province) {
  //       const city =
  //         province.childs.find(v => v.codeID === parseInt(nativePlace[1])) || {}
  //       resStr = province.name + (city.name || '')
  //     }
  //     return resStr
  //   }
  // }
}
