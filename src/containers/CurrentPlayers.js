import React from 'react'
import User from '../components/user'

export default function CurrentPlayers(props) {

    const { users } = props.users
    return (
        <div className='room-container'>
            {users.map(user => {
                return (
                    <User user={user}/>
                )
            })}
        </div>
    )
}

