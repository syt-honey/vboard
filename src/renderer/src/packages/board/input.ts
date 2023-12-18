export function input(el, { start, update, finish }): { unsubscribe: () => void } {
    function down(ev): void {
        if (ev.button !== 0) return
        el.setPointerCapture(ev.pointerId)
        el.addEventListener('pointermove', move)
        start()
    }

    function move(ev): void {
        update(ev)
    }

    function up(ev): void {
        finish()
        el.removeEventListener('pointermove', move)
        el.releasePointerCapture(ev.pointerId)
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointerup', up)

    return {
        unsubscribe(): void {
            el.removeEventListener('pointerdown', down)
            el.removeEventListener('pointerup', up)
        }
    }
}
