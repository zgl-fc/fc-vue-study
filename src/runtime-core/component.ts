import { shallowReadonly } from '../reactivity/reactive'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
  }

  return component
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props)
  // initSlots()
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type
  const { setup } = Component

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props))
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult: any) {
  // setup 函数返回 function or object
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type
  instance.render = Component.render
}