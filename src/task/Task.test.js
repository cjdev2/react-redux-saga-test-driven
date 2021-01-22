import '@testing-library/jest-dom/extend-expect'
import createSample from "../test-util/sample";
import {render} from "@testing-library/react";
import Task from './Task'

describe('task', () => {
    test('render', () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const tasks = sample.taskArray({quantity: 3, profile})
        const props = {
            profile,
            tasks,
            taskName: '',
            errors: [],
            taskNameChanged: jest.fn(),
            addTaskRequest: jest.fn(),
            updateTaskRequest: jest.fn(),
            deleteTasksRequest: jest.fn()
        }

        // when
        const rendered = render(<Task {...props}/>)

        // then
        expect(rendered.getByText(`3 tasks in profile ${profile.name}`)).toBeInTheDocument()
        expect(rendered.getByText(tasks[0].name)).toBeInTheDocument()
        expect(rendered.queryByText(tasks[1].name)).toBeInTheDocument()
        expect(rendered.getByText(tasks[2].name)).toBeInTheDocument()
    })
})
