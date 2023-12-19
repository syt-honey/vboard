interface SVGPencil
    extends Pick<React.SVGProps<SVGSVGElement>, 'className' | 'style' | 'width' | 'height'> {
    opened: boolean
}

export const SVGPencil = ({ opened }: SVGPencil): React.ReactElement => {
    return opened ? (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid meet"
        >
            <g transform="translate(0,512) scale(0.1,-0.1)" fill="#fff" stroke="none">
                <path
                    d="M1270 4676 c-125 -22 -191 -88 -198 -200 -5 -74 16 -125 72 -173 57
-51 90 -57 235 -44 92 9 151 9 220 1 346 -39 513 -225 528 -586 5 -115 3 -140
-15 -200 -26 -86 -64 -146 -137 -218 -121 -118 -295 -216 -750 -421 -474 -213
-678 -334 -872 -518 -317 -301 -425 -721 -307 -1197 95 -383 352 -665 739
-811 144 -54 311 -89 446 -92 102 -2 107 -1 155 28 134 82 137 273 5 361 -32
21 -58 27 -146 35 -399 37 -673 229 -773 539 -32 100 -43 182 -43 314 0 141
21 229 79 341 47 90 184 229 304 309 114 75 340 191 608 311 546 246 777 391
937 590 159 198 221 422 194 706 -50 530 -355 857 -866 928 -98 14 -331 12
-415 -3z"
                />
                <path
                    d="M4065 3601 c-51 -24 -2136 -2112 -2154 -2156 -18 -49 -201 -976 -201
-1023 0 -103 71 -185 179 -206 36 -7 955 170 1041 201 39 13 192 162 1094
1062 1105 1103 1096 1093 1096 1181 0 94 3 90 -423 519 -268 269 -415 409
-442 422 -52 24 -138 24 -190 0z m319 -710 l220 -220 -171 -178 c-94 -98 -195
-202 -225 -230 l-53 -53 -225 225 -225 225 225 225 c124 124 227 225 230 225
3 0 104 -99 224 -219z m-749 -761 l220 -220 -140 -141 c-77 -77 -327 -325
-556 -550 l-417 -409 -273 -55 c-150 -30 -274 -55 -274 -55 -1 0 23 126 54
280 l56 280 545 545 c300 300 549 545 555 545 5 0 109 -99 230 -220z"
                />
            </g>
        </svg>
    ) : (
        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid meet"
        >
            <g transform="translate(0,512) scale(0.1,-0.1)" fill="#fff" stroke="none">
                <path
                    d="M3885 5104 c-46 -14 -103 -69 -783 -747 -531 -531 -739 -744 -755
       -777 -29 -59 -29 -149 1 -206 59 -116 196 -166 312 -113 33 15 127 102 360
       334 l315 315 289 -289 288 -288 -307 -304 c-169 -167 -318 -323 -331 -345 -69
       -118 -23 -272 100 -336 57 -30 155 -31 211 -1 24 13 342 324 776 760 689 690
       737 741 749 786 17 62 7 138 -24 191 -32 53 -970 989 -1015 1011 -47 24 -127
       28 -186 9z m493 -1301 l-163 -163 -287 287 -288 288 162 162 163 163 287 -287
       288 -288 -162 -162z"
                />
                <path
                    d="M125 4726 c-100 -44 -151 -173 -110 -274 11 -26 249 -270 798 -819
       l782 -783 -607 -607 c-422 -423 -612 -619 -623 -645 -28 -69 -315 -1269 -315
       -1320 0 -27 6 -63 13 -81 36 -83 129 -147 219 -147 26 0 212 41 415 90 202 50
       481 118 618 152 138 33 268 69 290 80 26 13 256 235 642 621 l603 602 787
       -786 c781 -779 788 -787 841 -799 119 -27 225 33 258 148 18 60 13 106 -16
       162 -29 55 -4367 4386 -4412 4405 -45 18 -142 19 -183 1z m2095 -2511 l285
       -285 -568 -568 -568 -568 -377 -91 c-207 -50 -378 -91 -379 -90 -1 1 39 171
       89 377 l90 375 567 568 c311 312 568 567 571 567 3 0 133 -128 290 -285z"
                />
            </g>
        </svg>
    )
}