import {lensPathWithDefault} from "../compose-util/compose-connected";

const summaryModel = {
    profileCount: lensPathWithDefault(['summary', 'profileCount'], 0),
    taskCount: lensPathWithDefault(['summary', 'taskCount'], 0)
}

export default summaryModel
