import React from 'react'

export default function User(props) {
    return (
        <div className="ui purple message">
            <div className="header">
                {props.user}
            </div>
        </div>
    )
}