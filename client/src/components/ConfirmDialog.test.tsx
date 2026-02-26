import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders the provided message', () => {
    render(<ConfirmDialog message="Delete this recipe?" onConfirm={() => {}} onCancel={() => {}} />)
    expect(screen.getByText('Delete this recipe?')).toBeInTheDocument()
  })

  it('calls onConfirm when Delete is clicked', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog message="Sure?" onConfirm={onConfirm} onCancel={() => {}} />)
    await userEvent.click(screen.getByText('Delete'))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog message="Sure?" onConfirm={() => {}} onCancel={onCancel} />)
    await userEvent.click(screen.getByText('Cancel'))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('calls onCancel when the backdrop is clicked', () => {
    const onCancel = vi.fn()
    const { container } = render(
      <ConfirmDialog message="Sure?" onConfirm={() => {}} onCancel={onCancel} />
    )
    fireEvent.click(container.firstChild as HTMLElement)
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
