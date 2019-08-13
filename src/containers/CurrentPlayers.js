import React from 'react'
import User from '../components/User'

export default function CurrentPlayers(props) {

    return (
        <div className='room-container'>
            {props.users.map(user => {
                return (
                    <User key={user} user={user}/>
                )
            })}
        </div>
    )
}

