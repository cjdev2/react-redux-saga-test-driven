import Profile from "../profile/Profile";

import createSample from "../test/sample";
const sample = createSample()
const profiles = sample.profileArray(3)

const Top = () => <Profile profiles={profiles}/>

export default Top;
