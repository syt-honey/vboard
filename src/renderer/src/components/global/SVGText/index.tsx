interface SVGTextProps
    extends Pick<React.SVGProps<SVGSVGElement>, 'className' | 'style' | 'width' | 'height'> {}

export const SVGText = ({ ...restProps }: SVGTextProps): React.ReactElement => {
    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid meet"
            {...restProps}
        >
            <g transform="translate(0,512) scale(0.1,-0.1)" stroke="none">
                <path
                    d="M782 4469 c-46 -14 -118 -88 -131 -135 -7 -24 -11 -173 -11 -395 l0
-355 26 -53 c67 -134 244 -158 342 -46 23 27 44 63 51 90 6 25 11 134 11 259
l0 216 640 0 640 0 0 -1489 0 -1490 -242 -3 c-226 -3 -246 -4 -283 -25 -77
-41 -115 -105 -115 -193 0 -84 53 -161 132 -194 33 -14 125 -16 718 -16 743 0
720 -2 784 58 81 76 88 220 13 300 -12 13 -40 34 -62 45 -37 21 -57 22 -282
25 l-243 3 0 1490 0 1489 640 0 640 0 0 -216 c0 -260 6 -291 70 -355 105 -105
268 -80 334 52 l26 53 0 354 c0 252 -4 367 -12 396 -16 53 -81 118 -134 134
-52 15 -3499 16 -3552 1z"
                />
            </g>
        </svg>
    )
}
