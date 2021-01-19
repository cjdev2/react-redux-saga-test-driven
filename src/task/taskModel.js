import {lensPathWithDefault} from "../compose-util/compose-connected";

const taskModel = {
    profile: lensPathWithDefault(['task', 'profile'], {id: 'null-profile-id', name: 'null-profile-name'}),
    tasks: lensPathWithDefault(['task', 'tasks'], []),
    taskName: lensPathWithDefault(['task', 'taskName'], '')
}

export default taskModel
