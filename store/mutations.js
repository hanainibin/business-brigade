const mutations = {
  setState (state, obj) {
    state[obj.module][obj.key] = obj.value
  }
}
export default mutations
