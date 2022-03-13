# emit
emit 原理 其实就是将父组件的函数和其他的props一样传过去，子组件里面调用对应的函数就行了

# slots的原理
其实和props差不多，有点绕是因为编译原理的原因，比较抽象
可插槽的组件 children 是对象，将对象转换成对应 接受props返回Vnode的函数
在可插槽组件中调用对应的函数，传入自己的数据,所以插槽作用域是子组件的

# provide inject的原理
就是每个实例上维护一个 provides 对象 和 一个parent指向父实例
每个provides对象与父实例构成原型链
我们读inject的时候是读的 parent.provides上的属性,因为是原型链所以父上面找不到，继续往上找，没有的话就是provide提供的默认值

# patchProps

# patchChildren
[] => text


