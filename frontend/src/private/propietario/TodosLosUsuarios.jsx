/* eslint-disable react/prop-types */
import React from 'react'
import { User } from './IconsNav'
const TodosLosUsuarios = ({allUsers}) => {
  return (
    <>
      {allUsers.map((user,i)=>{
        return(
          <div className='item-user-list' key={i}>
            <div className='user'>
              <User/>
              <div className='user-texts'>
                <span className='user-name'>{user.name}</span>
                <span className='user-email'>{user.email }</span>
              </div>
            </div>
          </div>
        )
      })}    
    </>
  )
}

export default TodosLosUsuarios