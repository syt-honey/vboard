// used in board toolbox
interface SVGBoardPencilProps
    extends Pick<React.SVGProps<SVGSVGElement>, 'className' | 'style' | 'width' | 'height'> {}

export const SVGBoardPencil = ({ ...restProps }: SVGBoardPencilProps): React.ReactElement => {
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
                    d="M3795 4945 c-81 -17 -165 -56 -239 -109 -33 -25 -685 -669 -1448
-1433 l-1386 -1388 -281 -851 c-155 -468 -281 -864 -281 -880 0 -58 67 -124
127 -124 10 0 403 128 873 285 l855 285 1411 1413 c1538 1538 1453 1448 1505
1617 19 59 23 99 23 185 0 86 -4 126 -23 185 -45 148 -72 183 -350 461 -246
247 -259 258 -342 298 -48 23 -117 48 -155 56 -84 18 -208 18 -289 0z m288
-275 c78 -29 120 -66 348 -296 213 -217 243 -259 257 -369 19 -151 -23 -256
-158 -390 l-90 -90 -461 460 -460 460 90 87 c50 48 110 98 133 112 100 59 227
68 341 26z m-290 -878 l457 -457 -1150 -1150 -1150 -1150 -460 460 -460 460
1147 1147 c632 632 1150 1148 1153 1148 3 0 211 -206 463 -458z m-2489 -2491
l399 -399 -590 -196 c-325 -108 -595 -196 -601 -196 -6 0 77 262 184 583 211
632 202 607 206 607 2 0 183 -179 402 -399z"
                />
            </g>
        </svg>
    )
}
