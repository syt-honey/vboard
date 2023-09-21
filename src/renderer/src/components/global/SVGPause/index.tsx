import React from 'react'

export const SVGPause = (): React.ReactElement => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="20" height="20" fill="white" fillOpacity="0.01" />
            <rect x="13" y="1" width="4" height="18" rx="2" fill="#D9D9D9" />
            <rect x="3" y="1" width="4" height="18" rx="2" fill="#D9D9D9" />
        </svg>
    )
}

export default SVGPause
