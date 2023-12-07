import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import React, { useCallback, useContext, useMemo, useEffect } from 'react'

import appIcon from '../assets/icon/app.svg'
import { PermissionContext } from '../components/StoreProvider'
import { SVGCamera, SVGMic, SVGDesktop } from '../components/global'

export const PermissionPage = observer<React.FC>(() => {
    const { t } = useTranslation()
    const permissionStore = useContext(PermissionContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (permissionStore.checkDevicesPermission) {
            navigate('/')
        }
    }, [permissionStore.checkDevicesPermission])

    const permission = useMemo(() => {
        return [
            {
                enable: permissionStore.videoPermission,
                icon: <SVGCamera isMuted={false} />,
                title: t('camera'),
                info: t('cameraInfo'),
                handleChange: async (): Promise<void> => {
                    if (permissionStore.videoPermission) return

                    permissionStore.updateVideoPermission(
                        await permissionStore.requestVideoPermission()
                    )
                }
            },
            {
                enable: permissionStore.audioPermission,
                icon: <SVGMic isMuted={false} />,
                title: t('mic'),
                info: t('micInfo'),
                handleChange: async (): Promise<void> => {
                    if (permissionStore.audioPermission) return

                    permissionStore.updateAudioPermission(
                        await permissionStore.requestAudioPermission()
                    )
                }
            },
            {
                enable: permissionStore.screenPermission,
                icon: <SVGDesktop />,
                title: t('screen'),
                info: t('recordInfo'),
                handleChange: async (): Promise<void> => {
                    if (permissionStore.screenPermission) return

                    if (!permissionStore.requestScreenPermissionByApi()) {
                        permissionStore.updateScreenPermission(
                            await permissionStore.requestScreenPermission()
                        )
                    }
                }
            }
        ]
    }, [
        permissionStore.videoPermission,
        permissionStore.audioPermission,
        permissionStore.screenPermission
    ])

    const continueBtnDiabled = useMemo(
        () => permissionStore.checkDevicesPermission,
        [permissionStore.checkDevicesPermission]
    )

    const handleContinue = useCallback(() => {
        if (!continueBtnDiabled) {
            navigate('/')
        }
    }, [continueBtnDiabled])

    return (
        <div className="permission-page">
            <img style={{ width: '40px' }} src={appIcon} alt="app-icon" />
            <h3 className="welcome">{t('welcome')}</h3>
            <p className="welcome-sub">{t('welcomeSub')}</p>

            {permission.map((item, index) => {
                return (
                    <div key={index} className="permission-item">
                        {item.icon}
                        <div>
                            <p className="permission-item-title">{item.title}</p>
                            <p className="permission-item-sub">{item.info}</p>
                        </div>
                        <Button
                            className={`devices-operator${
                                item.enable ? '' : ' devices-operator-off'
                            }`}
                            shape="round"
                            onClick={item.handleChange}
                        >
                            {item.enable ? t('done') : t('enable')}
                        </Button>
                    </div>
                )
            })}
            <Button
                onClick={handleContinue}
                className="continue"
                disabled={!continueBtnDiabled}
                shape="round"
            >
                {t('continue')}
            </Button>
        </div>
    )
})

export default PermissionPage
