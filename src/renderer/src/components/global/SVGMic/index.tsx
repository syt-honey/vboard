import React from 'react'

export interface SVGMicProps
    extends Pick<React.SVGProps<SVGSVGElement>, 'className' | 'style' | 'width' | 'height'> {
    /** 0~1 */
    volume: number
    isMuted: boolean
}

export const SVGMic = /* @__PURE__ */ React.memo<SVGMicProps>(function SVGMic({
    isMuted,
    volume,
    ...restProps
}: SVGMicProps) {
    const vHeight = 14
    const vWidth = 8
    const vBaseX = 8
    const vBaseY = 4

    return isMuted ? (
        <svg
            fill="none"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                className="icon-stroke-color"
                d="m5 5 14 14"
                stroke="#D9D9D9"
                strokeLinejoin="round"
                strokeWidth="1.25"
            ></path>
            <path
                className="icon-fill-color"
                clipRule="evenodd"
                d="M19.277 16.625H20v-1.25h-1.973l1.25 1.25Zm-3.239 2.065.89.89a4.602 4.602 0 0 1-2.716 1.04l-.212.005h-4a4.626 4.626 0 0 1-4.55-3.787l-.033-.213H4v-1.25h2c.345 0 .625.28.625.625a3.375 3.375 0 0 0 3.19 3.37l.185.005h4a3.36 3.36 0 0 0 2.038-.685Zm.587-4.717V8a4.625 4.625 0 0 0-8.5-2.526l.911.91a3.374 3.374 0 0 1 6.281.991H14v1.25h1.375v.75H14v1.25h1.375v.75h-1.348l1.25 1.25h.098v.098l1.25 1.25Zm-2.587 2.717.89.89A4.625 4.625 0 0 1 7.375 14v-3.973l1.25 1.25v.098h.098l1.25 1.25H8.625V14a3.375 3.375 0 0 0 5.413 2.69Z"
                fill="#D9D9D9"
                fillRule="evenodd"
            ></path>
        </svg>
    ) : (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...restProps}
        >
            <defs>
                <clipPath id="icon-mic-v-clip">
                    <rect height={vHeight} rx={vWidth / 2} width={vWidth} x={vBaseX} y={vBaseY} />
                </clipPath>
            </defs>
            <path d="M0 0h24v24H0z" fill="#999CA3" opacity=".01" />
            <rect
                clipPath="url(#icon-mic-v-clip)"
                fill="#fff"
                height={vHeight}
                width={vWidth}
                x={vBaseX}
                y={vBaseY}
            />
            <path
                d="M4 16.625h2v-1.25H4v1.25Zm6 4h4v-1.25h-4v1.25Zm8-4h2v-1.25h-2v1.25Zm-4 4A4.625 4.625 0 0 0 18.625 16h-1.25A3.375 3.375 0 0 1 14 19.375v1.25ZM5.375 16A4.625 4.625 0 0 0 10 20.625v-1.25A3.375 3.375 0 0 1 6.625 16h-1.25Z"
                fill="#fff"
            />
            <g clipPath="url(#icon-mic-v-clip)">
                <rect
                    fill="#44AD00"
                    height={vHeight * 2}
                    style={{
                        transform: `translateY(${(1 - volume) * vHeight}px)`,
                        transition: 'transform .1s'
                    }}
                    width={vWidth}
                    x={vBaseX}
                    y={vBaseY}
                />
            </g>
        </svg>
    )
})

export default SVGMic
