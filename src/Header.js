import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Button } from 'react-bootstrap'
import logo from './logo.svg';
export default function Header()
{
    return (
        <div className="header">
            Preboard Exams
            <img className={'App-logo'} src={logo} alt="React"></img>
            <span style={{ flex: 1 }}></span>
            <Button variant="success">
                <FontAwesomeIcon icon={faUser} />
            </Button>

        </div>
    )
}
