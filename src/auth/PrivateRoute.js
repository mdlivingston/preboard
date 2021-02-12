import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ component: Component, ...restOfProps })
{
    const { currentUser } = useAuth()
    return (
        <Route {...restOfProps}
            render={props =>
            {
                return currentUser ? <Component {...props} /> : <Redirect to="/login" />
            }} />
    )
}
