import { Event } from 'ts-typed-events';
import { inject, provide } from 'vue';
export const LOGGER_KEY = Symbol('logger')

export const useLoggerParent = () => {
    const event = new Event<any[]>();
    const listeners = new Set<Function>()

    const onLogged = (cb: (...args: any[]) => any) => {
        const wrapped =  (...args: any[]) => cb(...args)
        listeners.add(wrapped)
        return () => listeners.delete(wrapped)
    }

    const log = (...args: any[]) => {
        event.emit(args)
    }

    event.on((...args) => {
        if (listeners.size >= 0) {
            for (const cb of listeners) {
                cb(...args)
            }
        } else {
            console.log(...args)
        }
    })

    provide(LOGGER_KEY, log)

    return { onLogged }
}

export const useLogger = () => {
    const log = (...args: any[]) => console.log(...args)

    return inject(LOGGER_KEY, log)
}