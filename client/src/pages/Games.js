import { useState, useEffect } from 'react'
import ServerAuth from '../ServerAuth'
import { useAuth } from '../hooks/useAuth';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import muiTableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const TableCell = styled(muiTableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.light,
  },
  padding: "6px 6px"
}))

export const Games = () => {

  const auth = useAuth()

  const [rows, setRows] = useState([])

  const formatRows = (rows) => {
    return rows.map((row) => {
      return {
        id: row.id,
        color: row.user_color,
        thinkingTime: row.engine_config.thinkingTime,
        pvSort: row.engine_config.pvSort ? "On" : "Off",
        result: row.result,
        pgn: row.pgn
      }
    }).sort((a, b) => (b.id - a.id))
  }

  useEffect(() => {
    ServerAuth.fetchgames(auth.session.uid, (x) => setRows(formatRows(x)))
  }, [])

  return (
    <GamesTable rows={rows} />
  )
}

const GamesTable = ({rows}) => {

  const CopyToClipBoard = async (text) => {
    if ('clipboard' in navigator)
      return await navigator.clipboard.writeText(text)
    else
      return document.execCommand('copy', true, text)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 150 }} size="small" aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell >Game Id</TableCell>
            <TableCell>User Color</TableCell>
            <TableCell>Thinking Time</TableCell>
            <TableCell>PV Sort</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Copy PGN</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={`game-${i}`}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.color}</TableCell>
              <TableCell>{row.thinkingTime}</TableCell>
              <TableCell>{row.pvSort}</TableCell>
              <TableCell>{row.result}</TableCell>
              <TableCell>
                <Button onClick={() => CopyToClipBoard(row.pgn)}>
                  <ContentCopyIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Games