import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import logo from './logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Profile from './auth/Profile';

export default function Header()
{
    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout()
    {
        setError('')

        try
        {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    return (
        <div className="header">
            Preboard Exams
            <img className={'App-logo'} src={logo} alt="React"></img>
            <span style={{ flex: 1 }}></span>
            <Dropdown className="profile-btn">
                <Dropdown.Toggle variant="success" >
                    <FontAwesomeIcon icon={faUser} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/user">Profile</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {/* <Button variant="success">
                <FontAwesomeIcon icon={faUser} />
            </Button> */}

        </div>
    )
}
