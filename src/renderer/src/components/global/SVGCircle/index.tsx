interface SVGCircleProps
    extends Pick<React.SVGProps<SVGSVGElement>, 'className' | 'style' | 'width' | 'height'> {}

export const SVGCircle = ({ ...restProps }: SVGCircleProps): React.ReactElement => {
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
                    d="M2315 4204 c-209 -14 -488 -57 -680 -105 -1023 -258 -1672 -892
-1632 -1594 18 -308 138 -562 385 -817 396 -408 988 -664 1742 -755 181 -21
635 -24 820 -5 634 67 1191 271 1595 587 112 88 290 275 357 375 137 207 202
394 215 615 15 269 -77 549 -262 790 -63 82 -224 244 -310 311 -389 304 -926
506 -1540 579 -125 15 -563 27 -690 19z m675 -319 c622 -78 1146 -295 1483
-615 463 -438 459 -992 -10 -1430 -788 -736 -2487 -844 -3507 -223 -712 434
-858 1081 -362 1602 361 377 1006 633 1726 685 120 8 550 -3 670 -19z"
                />
            </g>
        </svg>
    )
}
