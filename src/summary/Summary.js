import './Summary.css'
import ErrorComponent from '../error/ErrorComponent';

const Summary = ({profileCount, taskCount, errors}) =>
    <div className={'Summary'}>
        <ErrorComponent errors={errors}/>
        <span>Number of profiles = {profileCount}</span>
        <span>Number of tasks across all profiles = {taskCount}</span>
    </div>

export default Summary;
