import './count-down.css'
interface CountDownProps {
    count: number
}

export const CountDown: React.FC<CountDownProps> = ({ count }: CountDownProps) => {
    return (
        <div className="recording-container">
            <div className="count-down">{count}</div>
        </div>
    )
}

export default CountDown
