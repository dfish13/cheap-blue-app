import React, { useState, useEffect, useContext, createContext } from "react";
import ServerAuth from '../ServerAuth'

const authContext = createContext();

export const ProvideAuth = ({ children }) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
    return useContext(authContext)
}

const useProvideAuth = () => {
    const [session, setSession] = useState(null)

    const login = (uname, pass, cb, errorCB) => {
        return ServerAuth.login(uname, pass, (s) => {
            setSession(s)
            cb()
        }, errorCB)
    }
    
    const logout = (cb) => {
        return ServerAuth.logout(session, () => {
            setSession(null)
            cb()
        })
    }
    
    const adduser = (uname, pass, cb, errorCB) => {
        return ServerAuth.adduser(uname, pass, (s) => {
            setSession(s)
            cb()
        }, errorCB)
    }

    const saveGameConfig = (gameState) => {
        setSession({
            uid: session.uid,
            uname: session.uname,
            game: gameState
        })
    }

    useEffect(() => {
        ServerAuth.getsession((s) => {
            setSession(s)
        })
    }, [])

    useEffect(() => {
        ServerAuth.syncsession(session)
    }, [session])
    
    return {
        session,
        saveGameConfig,
        login,
        logout,
        adduser
    }
}