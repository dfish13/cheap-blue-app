import React, {useEffect, useState, useCallback} from 'react';

import {Table, Td} from './StyledComponents';

const axios = require('axios');

const DepthSlider = ({startDepth, min, max, changeCallback}) => {

    const [depth, setDepth] = useState(null);
    const [mouseState, setMouseState] = useState(null);

    useEffect(() => setDepth(startDepth), [startDepth])

    useEffect(() => {
        if (mouseState === "up") {
          changeCallback(depth)
        }
    }, [mouseState])

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
                onMouseUp={() => setMouseState("up")}
                onMouseDown={() => setMouseState("down")}
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

    const depthChangeCallback = useCallback((d) => {
        setDepth(d);
    })

    const perft = () => {
        axios.post('/perft', { fen: fen, depth: depth})
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
            <DepthSlider startDepth={2} min={1} max={8} changeCallback={depthChangeCallback}/>
            <button onClick={perft}>Do Perft</button>
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