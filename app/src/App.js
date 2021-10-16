import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

import Navbar from "./components/NavBar";

import Game from './Game.js'
import GameConfig from "./components/GameConfig"

import { ProvideAuth, useAuth } from './hooks/useAuth'

export default function App() {
  return (
    <ProvideAuth>
      <Router>
        <div>
          <Navbar />
          <Switch>
            <Route path="/about">
              <AboutPage />
            </Route> 
            <Route path="/login">
              <LoginPage />
            </Route>
            <PrivateRoute path="/play">
              <PlayPage />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  );
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  let auth = useAuth()
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.session ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function AboutPage() {
  return (
    <div>
      <h3>About</h3>
      <p>Cheap Blue is a chess engine that I made from scratch.
        The name plays off the name of the first chess engine to defeat
        a world champion, Deep Blue. It may not be able to beat
        Garry Kasparov (yet), but it is decent and beats me most
        of the time.
      </p>
    </div>
    
  )
}

function PlayPage() {
  const auth = useAuth()
  return auth.session.game ? (
    <Game isAdmin={false}/>
  ) : (
    <GameConfig />
  )
}

const LoginBox = ({login, adduser}) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  return (
    <div className="loginBox">
      <label>
        Username
        <input type="text" onChange={(e) => setUsername(e.target.value)}/>
      </label>
      <br/>
      <label>
        Password
        <input type="password" onChange={(e) => setPassword(e.target.value)}/>
      </label>
      <br/>
      <p style={{color: 'red'}}>{error}</p>
      <button onClick={() => login(username, password, (err) => setError(err))}>Log in</button>
      <button onClick={() => adduser(username, password, (err) => setError(err))}>New user</button>
    </div>
  )
}

function LoginPage() {
  const history = useHistory()
  const location = useLocation()
  const auth = useAuth()

  const { from } = location.state || { from: { pathname: "/" } }

  const cb = () => {
    history.replace(from)
  }

  const login = (uname, pass, errorCB) => {
    return auth.login(uname, pass, cb, errorCB)
  }

  const adduser = (uname, pass, errorCB) => {
    auth.adduser(uname, pass, cb, errorCB)
  }

  return (
    <div>
      <h3> Log In </h3>
      <p>You need to log in to play against the engine because
         computation is done on the server side and I would rather
          not let some anonymous visitor, possibly russian or chinese bot, 
          spam the engine with requests and then get a big bill 
          from Jeff Bezos because I made his servers work too hard.
          Also I went through the trouble of adding a database and user
          authentication which was just a joy and definitely not a shit show.
          So please enjoy the fruits of my labor
          and be sure to make up a funny username and a password that ends 
          with 69 ;)
      </p>
      <LoginBox login={login} adduser={adduser}/>
    </div>
  )
}
