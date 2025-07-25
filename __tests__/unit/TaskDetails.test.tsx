import { initialData } from '@/__mocks__/Task'
import { TaskDetails } from '@/components/TaskDetails'
import { cleanup, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

let mockOnAcknowledge: () => void
let mockOnClose: () => void
let user: any

beforeEach(() => {
  mockOnAcknowledge = vi.fn()
  mockOnClose = vi.fn()
  user = userEvent.setup()
  cleanup()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('should renders TaskDetails component with initial data', async () => {
  render(
    <TaskDetails
      onAcknowledge={mockOnAcknowledge}
      initialData={initialData}
      onClose={mockOnClose}
    />,
  )
  expect(screen.getByTestId('dueAt').innerHTML).toBe('12/31/2024')
  expect(screen.getByTestId('status').innerHTML).toBe(initialData.status)
  expect(screen.getByTestId('tags').innerHTML).toBe(initialData?.tags?.join(', '))
})

test('should calls onAcknowledge when Acknowledge button is clicked', async () => {
  render(
    <TaskDetails
      onAcknowledge={mockOnAcknowledge}
      initialData={initialData}
      onClose={mockOnClose}
    />,
  )

  await user.click(screen.getByTestId('details-acknowledge-button'))
  expect(mockOnAcknowledge).toHaveBeenCalledTimes(1)
})

test('should calls onClose when close button is clicked', async () => {
  render(
    <TaskDetails
      onAcknowledge={mockOnAcknowledge}
      initialData={initialData}
      onClose={mockOnClose}
    />,
  )

  await user.click(screen.getByTestId('details-close-button'))
  expect(mockOnClose).toHaveBeenCalledTimes(1)
})

test('should switches activity tabs when clicked', async () => {
  render(
    <TaskDetails
      onAcknowledge={mockOnAcknowledge}
      initialData={initialData}
      onClose={mockOnClose}
    />,
  )

  await user.click(screen.getByTestId('history'))
  const historyTab = screen.getByTestId('history')
  console.log(historyTab.querySelector('[data-active="true"]'))
  expect(historyTab.ariaSelected).toBeTruthy

  await user.click(screen.getByTestId('comments'))
  const commentsTab = screen.getByTestId('comments')
  expect(commentsTab.ariaSelected).toBeTruthy
  expect(historyTab.ariaSelected).toBeFalsy

  await user.click(screen.getByTestId('all'))
  const AllTab = screen.getByTestId('all')
  expect(AllTab.ariaSelected).toBeTruthy
  expect(commentsTab.ariaSelected).toBeFalsy
})
