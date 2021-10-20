import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

import { alpha, styled } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


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

    const [config, setConfig] = useState({
        thinkingTime: 3,
        pvSort: true,
        isBlack: false,
    })

    const auth = useAuth()

    const handleSwitch = (e) => {
        setConfig({
            ...config,
            [e.target.name]: e.target.checked
        })
    }

    const handleSlider = (e, newT) => {
        setConfig({
            ...config,
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
        const pgnHeader = [
            '[Event "Casual game on Cheap Blue App"]',
            `[Date "${(new Date()).toDateString()}"]`,
            `[White "${config.isBlack ? auth.session.uname : "Cheap Blue"}"]`,
            `[Black "${config.isBlack ? "Cheap Blue" : auth.session.uname}"]`,
            `[pvSort "${config.pvSort ? "On" : "Off"}"]`,
            `[thinkingTime "${timeFormat(config.thinkingTime)}"]`,
            ''
        ]
        
        auth.saveGameConfig({
            ...config,
            pgnHeader: pgnHeader,
            pgn: ''
        })
    }

    return (
        <Box>
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Game Config</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        control={ <SideSwitch checked={config.isBlack} onChange={handleSwitch} name="isBlack" /> }
                        label="Choose side"
                    />
                    <FormControlLabel
                        control={ <Switch checked={config.pvSort} onChange={handleSwitch} name="pvSort" /> }
                        label="PV Sort (Increases playing strength)"
                    />
                    <Typography id="input-slider" gutterBottom>
                        Thinking time
                    </Typography>
                    <Slider
                        aria-label="Thinking Time"
                        defaultValue={3}
                        valueLabelDisplay="auto"
                        valueLabelFormat={timeFormat}
                        getAriaValueText={timeFormat}
                        min={1}
                        max={5}
                        onChange={handleSlider}
                    />
                    <Button variant="outlined" onClick={save}>Play</Button>
                </FormGroup>
            </FormControl>
        </Box>
    )
}

export const makePGN = (header, pgn) => {
    return header.join('\n') + pgn
}

export default GameConfig