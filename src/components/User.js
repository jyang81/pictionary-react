import React from 'react'

export default function User(props) {
    return (
        <div className="ui blue message">
            <div className="header">
                {props.user}
            </div>
        </div>
    )
}