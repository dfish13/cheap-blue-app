import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from 'react-router-dom'

import {
    Nav,
    NavLogo,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
    Button
} from './NavBarElements';

const Navbar = () => {

    const auth = useAuth()
    
    return (
        <>
           <Nav>
            <NavLogo to="/">
                Cheap Blue
            </NavLogo>
            <Bars />

            <NavMenu>
                <NavLink to="/about" activeStyle>
                    About
                </NavLink>
                <NavLink to="/play" activeStyle>
                    Play
                </NavLink>
                {auth.session ? (
                    <LogOutButton />
                ) :
                (
                    <NavBtn>
                        <NavBtnLink to="/login">Log In</NavBtnLink>                
                    </NavBtn>
                )}
                
            </NavMenu> 
           </Nav> 
        </>
    )
}

const LogOutButton = () => {

    const auth = useAuth()
    const history = useHistory()

    const logout = () => {auth.logout(() => history.push("/"))}

    return (
        <p style={{color: 'springgreen'}}>
            {auth.session.uname}
            <Button onClick={logout}> Log Out </Button>
        </p>
    )
}

export default Navbar;