import '@testing-library/jest-dom/extend-expect'
import createSample from '../test-util/sample';
import {render} from '@testing-library/react';
import Task from './Task'
import userEvent from '@testing-library/user-event';

describe('task view', () => {
    test('render profile and tasks', () => {
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

    test('task name changed function invoked when typing', () => {
        // given
        const sample = createSample()
        const profile = sample.profile()
        const tasks = sample.taskArray({quantity: 3, profile})
        const taskNameChanged = jest.fn()
        const shouldNotBeCalled = name => () => {
            throw Error(`should not have called function ${name}`)
        }
        const props = {
            profile,
            tasks,
            taskName: '',
            errors: [],
            taskNameChanged,
            addTaskRequest: shouldNotBeCalled('addTaskRequest'),
            updateTaskRequest: shouldNotBeCalled('updateTaskRequest'),
            deleteTasksRequest: shouldNotBeCalled('deleteTasksRequest')
        }
        const rendered = render(<Task {...props}/>)
        const taskNameDataEntry = rendered.getByPlaceholderText('task name')

        // when
        userEvent.type(taskNameDataEntry, 'the-name')

        // then
        expect(taskNameChanged.mock.calls).toEqual([
            ['t'], ['h'], ['e'], ['-'], ['n'], ['a'], ['m'], ['e']
        ])
    })
})
