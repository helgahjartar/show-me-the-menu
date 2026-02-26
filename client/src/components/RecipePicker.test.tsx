import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecipePicker from './RecipePicker'
import type { SetMenuItem } from '../types'
import { MealType } from '../types'

vi.mock('../api/recipes', () => ({
  fetchRecipes: vi.fn().mockResolvedValue([
    { id: 1, name: 'Pasta Carbonara', description: null, ingredients: 'pasta, eggs', instructions: 'cook', createdAt: '', updatedAt: '' },
    { id: 2, name: 'Chicken Soup', description: null, ingredients: 'chicken, water', instructions: 'boil', createdAt: '', updatedAt: '' },
  ]),
}))

const defaultProps = {
  dayOfWeek: 0,
  mealType: MealType.Dinner,
  current: undefined as SetMenuItem | undefined,
  onSave: vi.fn(),
  onClose: vi.fn(),
}

beforeEach(() => {
  defaultProps.onSave.mockClear()
  defaultProps.onClose.mockClear()
})

describe('RecipePicker', () => {
  it('displays the correct day and meal type heading', async () => {
    render(<RecipePicker {...defaultProps} />)
    expect(screen.getByText('Monday - Dinner')).toBeInTheDocument()
  })

  it('shows the recipe list in pick mode by default', async () => {
    render(<RecipePicker {...defaultProps} />)
    expect(await screen.findByText('Pasta Carbonara')).toBeInTheDocument()
    expect(screen.getByText('Chicken Soup')).toBeInTheDocument()
  })

  it('switches to custom name form when Custom tab is clicked', async () => {
    render(<RecipePicker {...defaultProps} />)
    await userEvent.click(screen.getByText('Custom'))
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('calls onSave with recipe data when a recipe is selected', async () => {
    render(<RecipePicker {...defaultProps} />)
    await userEvent.click(await screen.findByText('Pasta Carbonara'))
    expect(defaultProps.onSave).toHaveBeenCalledWith({
      dayOfWeek: 0,
      mealType: MealType.Dinner,
      recipeId: 1,
      customName: 'Pasta Carbonara',
      notes: null,
    })
  })

  it('does not call onSave when custom name is submitted empty', async () => {
    render(<RecipePicker {...defaultProps} />)
    await userEvent.click(screen.getByText('Custom'))
    await userEvent.click(screen.getByText('Set'))
    expect(defaultProps.onSave).not.toHaveBeenCalled()
  })

  it('shows Clear Slot button only when a current item exists', () => {
    const { rerender } = render(<RecipePicker {...defaultProps} current={undefined} />)
    expect(screen.queryByText('Clear Slot')).not.toBeInTheDocument()

    const current: SetMenuItem = { dayOfWeek: 0, mealType: MealType.Dinner, recipeId: 1, customName: 'Pasta', notes: null }
    rerender(<RecipePicker {...defaultProps} current={current} />)
    expect(screen.getByText('Clear Slot')).toBeInTheDocument()
  })

  it('calls onSave with null when Clear Slot is clicked', async () => {
    const current: SetMenuItem = { dayOfWeek: 0, mealType: MealType.Dinner, recipeId: 1, customName: 'Pasta', notes: null }
    render(<RecipePicker {...defaultProps} current={current} />)
    await userEvent.click(screen.getByText('Clear Slot'))
    expect(defaultProps.onSave).toHaveBeenCalledWith(null)
  })
})
