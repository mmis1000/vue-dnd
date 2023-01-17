// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { test, expect  } from 'vitest'

test('async component with suspense', async () => {
  expect(App).toBeTruthy()
  const wrapper = mount(App)

  expect(wrapper.text()).toBeTruthy()
})