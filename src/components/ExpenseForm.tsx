import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import type { DrafExpense, Value } from "../types";
import { categories } from "../data/categories"
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { ErrorMessage } from "./errorMessage";
import { useBudget } from "../hooks/useBudget";


const ExpenseForm = () => {

  const [ expense , setExpense] = useState<DrafExpense>({
    amount: 0,
    expenseName: '',
    category: '',
    date: new Date()
  })

  const [ error, setError ] = useState('')
  const [previusAmount, setPreviusAmount] = useState(0)
  const { dispatch, state, remainingBudget } = useBudget()

  useEffect(() => { 
    if(state.editingId) {
      const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
      setExpense(editingExpense)
      setPreviusAmount(editingExpense.amount)
    }
  }, [state.editingId])

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    const isAmountField = ['amount'].includes(name)

    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value
    })
  }

  const handleChangeValue = ( value: Value ) => {
    setExpense({
      ...expense,
      date: value
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(Object.values(expense).includes('')) {
      setError('Todos los campos son obligatorios')
      return
    }

    if((expense.amount - previusAmount) > remainingBudget) {
      setError('Ese gasto se sale del presupuesto')
      return
    }

    if(state.editingId) {
      dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expense } } })
    } else {
      dispatch({ type: 'add-expense', payload: { expense } })
    }


    setExpense({
      amount: 0,
      expenseName: '',
      category: '',
      date: new Date()
    })

    setPreviusAmount(0)
  }

  return (
    <>
      <form 
        action="" 
        className="space-y-5" 
        onSubmit={ handleSubmit }
      >
        <legend
          className="ippercase text-center text-2xl font-black border-b-4 border-blue-500 py-2"        
        >
          {state.editingId ? 'Editar gasto' : 'Nuevo gasto'}
        </legend>

        { error && <ErrorMessage>{ error }</ErrorMessage>}

        <div className="flex flex-col gpa-2">
          <label 
            htmlFor="expenseName"
            className="text-xl"
          >
            Nombre gasto
          </label>


          <input 
            type="text" 
            name="expenseName" 
            placeholder="Añade el nombre del gasto"
            className="bg-slate-100 p-2 outline-none"
            id="expenseName" 
            value={expense.expenseName}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gpa-2">
          <label 
            htmlFor="amount"
            className="text-xl"
          >
            Cantidad:
          </label>

          <input 
            type="number" 
            name="amount" 
            placeholder="Añade la cantidad del gasto ej. 300"
            className="bg-slate-100 p-2 outline-none"
            id="amount" 
            value={expense.amount}
            onChange={ handleChange }
          />
        </div>

        <div className="flex flex-col gpa-2">
          <label 
            htmlFor="category"
            className="text-xl"
          >
            Categoria:
          </label>

          <select 
            name="category" 
            className="bg-slate-100 p-2 outline-none"
            id="category" 
            value={expense.category}
            onChange={ handleChange }
          >
            <option value="">-- Seleccione --</option>  
            {
              categories.map(category => (
                <option 
                  key={category.id}
                  value={category.id}
                >
                  { category.name }
                </option>
              ))
            }
          </select>
        </div>

        <div className="flex flex-col gpa-2">
          <label 
            htmlFor="amount"
            className="text-xl"
          >
            Fecha gasto:
          </label>

          <DatePicker
            className='bg-slate-100 p-2 border-0'
            value={expense.date}
            onChange={ handleChangeValue }
          />

        </div>

        <input
          type="submit"
          className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
          value={state.editingId ? 'Guardar cambios' : 'Nuevo gasto'}
        />

      </form>
    </>
  )
}

export { ExpenseForm }
