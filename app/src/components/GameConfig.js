import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

import { alpha, styled } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


const SideSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: blueGrey[900],
      '&:hover': {
        backgroundColor: alpha(blueGrey[900], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: blueGrey[900],
    },
  }));

const GameConfig = () => {

    const [options, setOptions] = useState({
        thinkingTime: 3,
        pvSort: true,
        killerMove: true,
        isBlack: false,
    })

    const auth = useAuth()

    const handleSwitch = (e) => {
        setOptions({
            ...options,
            [e.target.name]: e.target.checked
        })
    }

    const handleSlider = (e, newT) => {
        setOptions({
            ...options,
            thinkingTime: newT
        })
    }

    const timeFormat = (t) => {
        if (t > 1)
            return `${t} Seconds`
        else
        return `${t} Second`
    }

    const save = () => {
        const pgn = [
            '[Event "Casual Game on Cheap Blue App"]',
            `[Date "${(new Date()).toDateString()}"]`,
            `[White "${options.isBlack ? auth.session.uname : "Cheap Blue"}"]`,
            `[Black "${options.isBlack ? "Cheap Blue" : auth.session.uname}"]`,
            '[PlyCount "0"]',
            ''
        ]
        
        auth.saveGameConfig({
            ...options,
            pgn: pgn.join('\n')
        })
    }

    return (
        <Box>
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Game Config</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={ <SideSwitch checked={options.isBlack} onChange={handleSwitch} name="isBlack" /> }
                        label="Choose side"
                    />
                    <FormControlLabel
                        control={ <Switch checked={options.pvSort} onChange={handleSwitch} name="pvSort" /> }
                        label="Sort moves by principle variation"
                    />
                    <FormControlLabel
                        control={ <Switch checked={options.killerMove} onChange={handleSwitch} name="killerMove" /> }
                        label="Use killer move heuristic"
                    />
                    <Slider
                        aria-label="Thinking Time"
                        defaultValue={3}
                        valueLabelDisplay="auto"
                        valueLabelFormat={timeFormat}
                        getAriaValueText={timeFormat}
                        min={1}
                        max={8}
                        onChange={handleSlider}
                    />
                    <Button variant="contained" onClick={save}>Play</Button>
                </FormGroup>
            </FormControl>
        </Box>
    )
}

export default GameConfig