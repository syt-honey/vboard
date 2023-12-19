interface SVGRectProps
    extends Pick<React.SVGProps<SVGSVGElement>, 'className' | 'style' | 'width' | 'height'> {
}

export const SVGRect = ({ ...restProps }: SVGRectProps): React.ReactElement => {
    return (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid meet"
            {...restProps}
        >
            <g transform="translate(0,512) scale(0.1,-0.1)" stroke="none">
                <path
                    d="M78 4189 c-23 -12 -46 -35 -58 -59 -20 -39 -20 -56 -20 -1570 0
-1514 0 -1531 20 -1570 13 -26 34 -47 60 -60 39 -20 53 -20 2480 -20 2427 0
2441 0 2480 20 26 13 47 34 60 60 20 39 20 56 20 1570 0 1514 0 1531 -20 1570
-13 26 -34 47 -60 60 -39 20 -53 20 -2482 20 -2413 -1 -2443 -1 -2480 -21z
m4742 -1629 l0 -1350 -2260 0 -2260 0 0 1350 0 1350 2260 0 2260 0 0 -1350z"
                />
            </g>
        </svg>
    )
}
