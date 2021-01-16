import './Profile.css'
import * as R from 'ramda'
import {pluralize} from "../string-util/string-util";

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

const AddProfile = ({profileName, profileNameChanged, addProfileRequest}) => {
    const onKeyUp = event => {
        if (R.trim(profileName) === '') return
        if (event.key === 'Enter') addProfileRequest(profileName)
    }
    const onChange = event => {
        profileNameChanged(event.target.value)
    }
    return <input value={profileName}
                  autoFocus={true}
                  placeholder={'profile name'}
                  onKeyUp={onKeyUp}
                  onChange={onChange}/>
}

const ProfileView = ({profiles, profileName, profileNameChanged, addProfileRequest}) => {
    const header = `${profiles.length} ${pluralize({
        quantity: profiles.length,
        singular: 'profile',
        plural: 'profiles'
    })}`
    return <div className={'Profile'}>
        <h2>{header}</h2>
        <AddProfile profileName={profileName} profileNameChanged={profileNameChanged}
                    addProfileRequest={addProfileRequest}/>
        <ProfileList profiles={profiles}/>
    </div>
}

export default ProfileView;
