import { useMemo } from 'react'
import { Expense } from '../types/index';
import { formatDate } from '../helpers';
import { AmountDisplay } from './AmountDisplay';
import { useBudget } from '../hooks/useBudget';

import { categories } from '../data/categories';

import { 
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions
} from 'react-swipeable-list'
import "react-swipeable-list/dist/styles.css"


type ExpenseDetailProps = {
  expense: Expense
}

const ExpenseDetail = ({ expense }:ExpenseDetailProps) => {

  const { dispatch } = useBudget()

  const categoryInfo = useMemo(() => categories.filter(cat => cat.id === expense.category)[0], [expense])

  const leadingActions = () => (
    <LeadingActions> {/* Leading deslizar hacia la izquierda */}
      <SwipeAction
        onClick={() => dispatch({ type: 'get-expense-by-id', payload: { id: expense.id } })} 
      >
        Actualizar
      </SwipeAction>
    </LeadingActions>
  )

  const trailingActions = () => (
    <TrailingActions> {/* Trailing deslizar hacia la derecha */}
      <SwipeAction
        onClick={() => dispatch({ type: 'remove-expense',  payload: {id: expense.id}})}
        destructive={true} // Hace que desaparezca ese elemento
      >
        Eliminar
      </SwipeAction>
    </TrailingActions>
  )

  return (
    <SwipeableList>
      <SwipeableListItem 
        maxSwipe={30}
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
      >
        <div className="bg-white shadow-lg p-5 w-full border-b border-gray-200 flex gap-5 items-center">
          <div>
            <img 
              src={`/icono_${categoryInfo.icon}.svg`}
              alt='icono gasto' 
              className='w-20'
            />
          </div>
          <div className='flex-1 space-y-3'>
            <p className='text-sm font-bold uppercase text-slate-500'>{ categoryInfo.name }</p>
            <p>{ expense.expenseName }</p>
            <p className='text-slate-600 text-sm'>{ formatDate(expense.date!.toString())  }</p>
          </div>
          <AmountDisplay
            amount={ expense.amount }
          />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  )
}

export { ExpenseDetail }
