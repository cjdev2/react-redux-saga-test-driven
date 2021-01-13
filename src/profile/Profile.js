import './Profile.css'

const Profile = () => {
    return <div className={'Profile'}>
        <h2>3 Profiles</h2>
        <input value={''}
               placeholder={'new profile'}
               autoFocus={true}/>
        <div className={'elements'}>
            <span>First Profile</span>
            <button>delete</button>
            <span>Second Profile</span>
            <button>delete</button>
            <span>Third Profile</span>
            <button>delete</button>
        </div>
    </div>
}

export default Profile;
