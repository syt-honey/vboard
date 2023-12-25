import HomePage from '@renderer/pages/HomePage'
import BoardPage from '@renderer/pages/BoardPage'
import RecordingPage from '@renderer/pages/RecordingPage'
import BoardToolPage from '@renderer/pages/BoardToolPage'
import PermissionPage from '@renderer/pages/PermissionPage'

export enum RouteNameType {
    HomePage = 'HomePage',
    RecordingPage = 'RecordingPage',
    PermissionPage = 'PermissionPage',
    BoardPage = 'BoardPage',
    BoardToolPage = 'BoardToolPage'
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
    [RouteNameType.PermissionPage]: {
        title: 'Permission',
        component: PermissionPage,
        path: '/permission'
    },
    [RouteNameType.BoardPage]: {
        title: 'board',
        component: BoardPage,
        path: '/board'
    },
    [RouteNameType.BoardToolPage]: {
        title: 'board-toolbox',
        component: BoardToolPage,
        path: '/board-toolbox'
    }
}
