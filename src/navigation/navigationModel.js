import {lensPathWithDefault} from "../compose-util/compose-connected";

const navigationModel = {
    page: lensPathWithDefault(['navigation', 'page'], '')
}

export default navigationModel
