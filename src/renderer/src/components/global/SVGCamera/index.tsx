import React from 'react'

interface SVGCameraProps {
    isMuted: boolean
}

export const SVGCamera = ({ isMuted }: SVGCameraProps): React.ReactElement => {
    return (
        <>
            {isMuted ? (
                <svg
                    fill="none"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="m5 5 14 14"
                        stroke="#D9D9D9"
                        strokeLinejoin="round"
                        strokeWidth="1.25"
                    ></path>
                    <path
                        clipRule="evenodd"
                        d="m15.72 18.373.91.909a8.63 8.63 0 0 1-9.788-.364l-.232-.18.78-.976a7.38 7.38 0 0 0 8.33.61Zm2.434-2.87A7.625 7.625 0 0 0 7.497 4.846l.897.896a6.375 6.375 0 0 1 8.864 8.864l.896.897Zm-3.857 1.446.952.951A7.625 7.625 0 0 1 5.1 7.751l.951.952a6.375 6.375 0 0 0 8.246 8.246Zm.956-4.348a3.625 3.625 0 0 0-4.854-4.854l.964.964a2.378 2.378 0 0 1 2.926 2.926l.964.964Zm-.628-5.351a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25Z"
                        fill="#D9D9D9"
                        fillRule="evenodd"
                    ></path>
                </svg>
            ) : (
                <svg
                    fill="none"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="12"
                        cy="11"
                        r="7"
                        stroke="#D9D9D9"
                        strokeLinejoin="round"
                        strokeWidth="1.25"
                    ></circle>
                    <circle
                        cx="12"
                        cy="11"
                        r="3"
                        stroke="#D9D9D9"
                        strokeLinejoin="round"
                        strokeWidth="1.25"
                    ></circle>
                    <circle cx="14.625" cy="6.625" fill="#D9D9D9" r=".625"></circle>
                    <path
                        d="M7 18.25a8.004 8.004 0 0 0 10 0"
                        stroke="#D9D9D9"
                        strokeLinejoin="round"
                        strokeWidth="1.25"
                    ></path>
                </svg>
            )}
        </>
    )
}

export default SVGCamera
