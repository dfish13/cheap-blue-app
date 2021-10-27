import React, {useEffect, useState} from 'react';

import {Table, Td} from './StyledComponents';

const axios = require('axios');

const DepthSlider = ({startDepth, min, max, changeCallback}) => {

    const [depth, setDepth] = useState(startDepth);

    useEffect(() => setDepth(startDepth), [startDepth])

    const onChange = (e) => {
        setDepth(e.target.value) 
    }

    return (
        <div>
            <p>Depth = {depth}</p>
            <input
                type="range"
                value={depth}
                min={min}
                max={max}
                onChange={onChange}
                onMouseUp={() => changeCallback(depth)}
            />
        </div>
    )
}

const PerftUtil = ({fen}) => {

    const [depth, setDepth] = React.useState(1)
    const [perftResults, setPerftResults] = React.useState(
        {
            divided: [],
            nodes: 0
        }
    )

    const perft = () => {
        axios.post('api/engine/perft', { fen: fen, depth: depth})
        .then((res) => {
            setPerftResults(res.data)
        })
        .catch((err) => console.log(err));
    }

    const renderTable = () => {
        let rows = perftResults.divided.map((x) => {
            return (
                <tr>
                    <Td>{x.move}</Td>
                    <Td>{x.nodes}</Td>
                </tr>
            )
        })
        // insert at front
        rows.unshift(
            <tr>
                <Td>Total</Td>
                <Td>{perftResults.nodes}</Td>
            </tr>
        )

        return rows
    }

    return (
        <div>
            <DepthSlider startDepth={2} min={1} max={8} changeCallback={setDepth}/>
            <button onClick={perft}>Go Perft</button>
            <Table>
                <th>
                    <td>Move</td>
                    <td>Nodes</td>
                </th>
                {renderTable()}
            </Table>
        </div>
    )
}

export default PerftUtil