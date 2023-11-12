import './index.css'

import React from 'react'
import { Skeleton } from 'antd'

export const HomePageSkeletons: React.FC = () => {
    return (
        <div className="homepage-skeletons">
            {Array(3)
                .fill(0)
                .map((_, i) => (
                    <div key={i} className="homepage-skeletons-item">
                        <Skeleton active paragraph={{ rows: 0 }}></Skeleton>
                        <Skeleton.Button active shape="round" block></Skeleton.Button>
                    </div>
                ))}

            <Skeleton.Button active shape="round" block></Skeleton.Button>
        </div>
    )
}
