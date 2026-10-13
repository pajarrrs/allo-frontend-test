import { onScopeDispose, readonly, ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * Returns a read-only ref that follows `source` only after it stops changing for `delay` ms.
 */
export function useDebounce<T>(source: Ref<T>, delay = 300): Readonly<Ref<T>> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(source, value => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  onScopeDispose(() => clearTimeout(timer))

  return readonly(debounced) as Readonly<Ref<T>>
}
