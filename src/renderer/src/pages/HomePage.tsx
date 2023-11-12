import { Button, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import React, { useCallback, useContext, useEffect } from 'react'

import { DevicesTypeKey } from '../store/devices'
import { DevicesContext } from '../components/StoreProvider'
import { HomePageSkeletons } from '../components/Skeleton/Homepage'
import { ipcCreateCounterWindow, ipcHideMainWindow } from '../utils'

export const HomePage = observer<React.FC>(() => {
    const { t } = useTranslation()
    const devicesStore = useContext(DevicesContext)

    useEffect(() => {
        if (!devicesStore.checkDevices) {
            devicesStore.initDevices()
        }
    }, [devicesStore])

    const handleChange = useCallback(
        (value, type) => {
            devicesStore.setSelectedDevices(value, type)
        },
        [devicesStore]
    )

    const callRecording = (): void => {
        ipcHideMainWindow()
        ipcCreateCounterWindow({ url: '/counter' })
    }

    return (
        <div className="main-page">
            {!devicesStore.checkDevices ? (
                <HomePageSkeletons />
            ) : (
                <>
                    <div className="devices">
                        {Object.keys(devicesStore.devices).map((key) => {
                            return (
                                <div key={key}>
                                    <div className="devices-title">{t(`devices.${key}`)}</div>

                                    {devicesStore.devices[key].length > 0 &&
                                        renderSelect({
                                            type: key as DevicesTypeKey,
                                            devices: devicesStore.devices[key],
                                            defaultId: devicesStore.devices[key][0].deviceId,
                                            handleChange
                                        })}
                                </div>
                            )
                        })}
                    </div>
                    <Button className="start-btn" type="primary" onClick={callRecording}>
                        {t('start')}
                    </Button>
                </>
            )}
        </div>
    )
})

export interface SelectProps {
    devices: MediaDeviceInfo[]
    defaultId: string
    type: DevicesTypeKey
    handleChange: (value, type) => void
}

export const renderSelect = ({
    type,
    devices,
    defaultId,
    handleChange
}: SelectProps): React.ReactNode => {
    return (
        <Select defaultValue={defaultId} onChange={(value): void => handleChange(value, type)}>
            {devices.map(({ label, deviceId }) => {
                return (
                    <Select.Option key={deviceId} value={deviceId}>
                        {label}
                    </Select.Option>
                )
            })}
        </Select>
    )
}

export default HomePage
