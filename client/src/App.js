import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory,
} from "react-router-dom";

import Game from './Game.js'
import GameConfig from "./components/GameConfig"

import { ProvideAuth, useAuth } from './hooks/useAuth'
import NavBar from "./components/NavBar";
import { LoginDialog } from "./components/Dialogs";
import { theme, adminTheme } from "./theme.js"

import { ThemeProvider } from "@mui/material";
import Games from "./pages/Games.js";

export default function App() {
  return (
    <ProvideAuth>
      <AppWithAuth />
    </ProvideAuth>
  );
}

const AppWithAuth = () =>
{
  const auth = useAuth()
  const myTheme = (auth.session && auth.session.is_admin) ? adminTheme : theme
  console.log(myTheme)

  return (
    <ThemeProvider theme={myTheme}>
      <Router>
        <div>
          <NavBar />
          <Switch>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route> 
            <Route path="/play">
              <PPlayPage />
            </Route>
            <Route path="/games">
              <GamesPage />
            </Route> 
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// A wrapper for a page that opens a login
// dialog if you're not yet authenticated.
function PrivatePage({ children }) {
  
  const history = useHistory()
  const auth = useAuth()

  const close = () => {
    history.replace({ pathname: "/" })
  }

  return (
    <>
      {auth.session && ( children )}
      <LoginDialog
        open={!Boolean(auth.session)}
        handleClose={close}
        loginCB={() => {}}
      />
    </>
  )
}

function HomePage() {
  return (
    <div>
      <h3>Home</h3>
      <p>So this is the home page. You can click About in the menu above
        (the 3 bars thing) to read a little bit about the Cheap Blue chess engine.
        Or you can choose Play to play against it!
        Thats pretty much it. Gonna add some more stuff soon though.
      </p>
    </div>
  )
}

function AboutPage() {
  return (
    <div>
      <h3>About</h3>
      <p>Cheap Blue is a chess engine that I made.
        The name plays off the name of the first chess engine to defeat
        a world champion, Deep Blue. It may not be able to beat
        Magnus Carlsen (current world champion), but it plays pretty well and beats me most
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

function PPlayPage() {
  return (
    <PrivatePage>
      <PlayPage />
    </PrivatePage>
  )
}

function GamesPage()  {
  return (
    <PrivatePage>
      <Games />
    </PrivatePage>
  )
}
