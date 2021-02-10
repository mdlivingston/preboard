import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import logo from './logo.svg';

export default function Header()
{
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
                    <Dropdown.Item>Profile</Dropdown.Item>
                    <Dropdown.Item>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {/* <Button variant="success">
                <FontAwesomeIcon icon={faUser} />
            </Button> */}

        </div>
    )
}
