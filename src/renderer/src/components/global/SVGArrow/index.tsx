interface SVGArrowProps
    extends Pick<React.SVGProps<SVGSVGElement>, 'className' | 'style' | 'width' | 'height'> {}

export const SVGArrow = ({ ...restProps }: SVGArrowProps): React.ReactElement => {
    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid meet"
            {...restProps}
        >
            <g transform="translate(0,512) scale(0.1,-0.1)" stroke="none">
                <path
                    d="M1505 5101 c-170 -78 -177 -305 -12 -394 l42 -22 1420 -3 1420 -2
-2177 -2178 c-2015 -2016 -2177 -2180 -2188 -2222 -44 -167 103 -314 270 -270
42 11 206 173 2222 2188 l2178 2177 2 -1420 3 -1420 22 -42 c57 -106 191 -151
293 -98 41 21 88 75 105 119 14 36 15 231 13 1747 l-3 1706 -30 49 c-23 37
-44 56 -84 77 l-55 27 -1700 0 c-1629 0 -1703 -1 -1741 -19z"
                />
            </g>
        </svg>
    )
}
