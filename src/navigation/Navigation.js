import ErrorComponent from "../error/ErrorComponent";

const PageNotFound = ({page}) => <h1>{`Page '${page}' not found`}</h1>

const Navigation = ({page, errors, Profile, Task, Summary}) => {
    const pageMap = {
        profile: Profile,
        task: Task
    }
    const Component = pageMap[page] || PageNotFound
    return <div className={'Navigation'}>
        <ErrorComponent errors={errors}/>
        <Component/>
        <Summary/>
    </div>
}

export default Navigation;
