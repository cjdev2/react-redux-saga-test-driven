import './Profile.css'
import * as R from 'ramda'

const ProfileListItem = ({profile}) => {
    return <>
        <span>{profile.name}</span>
        <button>delete</button>
    </>
}

const ProfileList = ({profiles}) => {
    const createElement = profile => <ProfileListItem key={profile.id} profile={profile}/>
    const profileElements = R.map(createElement, profiles)
    return <div className={'elements'}>
        {profileElements}
    </div>
}

const Profile = ({profiles}) => {
    const header = `${profiles.length} profiles`
    return <div className={'Profile'}>
        <h2>{header}</h2>
        <input placeholder={'new profile'}
               autoFocus={true}/>
        <ProfileList profiles={profiles}/>
    </div>
}

export default Profile;
