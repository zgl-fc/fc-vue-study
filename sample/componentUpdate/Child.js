import { h } from "../../lib/mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, { emit }) { },
  render(proxy) {
    console.log('子组件重新渲染')
    console.log(this.msg);
    return h("div", {}, [h("div", {}, "child - props - msg: " + this.msg)]);
  },
};
