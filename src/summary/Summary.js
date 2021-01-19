import './Summary.css'

const Summary = ({profileCount, taskCount}) =>
    <div className={"Summary"}>
        <span>Number of profiles = {profileCount}</span>
        <span>Number of tasks across all profiles = {taskCount}</span>
    </div>

export default Summary;
