import './Summary.css'

const SummaryView = ({profileCount, taskCount}) =>
    <div className={"Summary"}>
        <span>Number of profiles = {profileCount}</span>
        <span>Number of tasks across all profiles = {taskCount}</span>
    </div>

export default SummaryView;
