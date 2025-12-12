import { checkPermission } from '../hooks/useAuth'

const permission = {
    mounted(el, binding) {
        const required = checkPermission(binding.value)

        if (!required) {
            el.parentNode?.removeChild(el)
        }
    }
}

export { permission }