import { type ClassValue, clsx } from "clsx";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return `${str}${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            });
        },
        easing: cubicOut
    };
};

export const newGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

export interface BetterPromise<T> extends Promise<T> {
    resolve: (value: T) => void
    reject: (reason: unknown) => void
}

export const betterPromise = <T>(): BetterPromise<T> => {
    let resolve: (value: T) => void
    let reject: (reason: unknown) => void
    const p = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.assign(p, { resolve, reject })
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const debounce = <T extends (...args: any[]) => any>(fn: T, ms: number) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let timeout: any | undefined
    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
        return new Promise((resolve) => {
            if (timeout) clearTimeout(timeout)
            timeout = setTimeout(() => resolve(fn(...args)), ms)
        })
    }
}


