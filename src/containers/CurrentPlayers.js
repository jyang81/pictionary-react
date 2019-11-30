import React from 'react'
import User from '../components/User'

export default function CurrentPlayers(props) {

    return (
        <div className='room-container'>
            <div className='current-users-title'>Who's playing now</div>
            {props.users.map(user => {
                return (
                    <User key={user} user={user}/>
                )
            })}
        </div>
    )
}

