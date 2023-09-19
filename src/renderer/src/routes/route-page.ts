import HomePage from '../pages/HomePage'
import RecordingPage from '../pages/RecordingPage'

export enum RouteNameType {
    HomePage = 'HomePage',
    RecordingPage = 'RecordingPage'
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
    }
}
