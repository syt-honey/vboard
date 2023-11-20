import HomePage from '../pages/HomePage'
import RecordingPage from '../pages/RecordingPage'
import CounterPage from '../pages/CounterPage'
import CameraPage from '../pages/CameraPage'
import PermissionPage from '../pages/PermissionPage'

export enum RouteNameType {
    HomePage = 'HomePage',
    RecordingPage = 'RecordingPage',
    CounterPage = 'CounterPage',
    CameraPage = 'CameraPage',
    PermissionPage = 'PermissionPage'
}

export type RouterPages = {
    readonly [key in RouteNameType]: {
        readonly title: string
        readonly hasHeader?: true
        readonly path: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        readonly component: React.FunctionComponent<React.FC<any>>
    }
}

export const routePages: RouterPages = {
    [RouteNameType.HomePage]: {
        title: 'HomePage',
        component: HomePage,
        path: '/'
    },
    [RouteNameType.RecordingPage]: {
        title: 'RecordingPage',
        component: RecordingPage,
        path: '/recording'
    },
    [RouteNameType.CounterPage]: {
        title: 'CounterPage',
        component: CounterPage,
        path: '/counter'
    },
    [RouteNameType.CameraPage]: {
        title: 'CameraPage',
        component: CameraPage,
        path: '/camera'
    },
    [RouteNameType.PermissionPage]: {
        title: 'Permission',
        component: PermissionPage,
        path: '/permission'
    },
}
