import './Pointer.css';

import PointerSvg from "./PointerSvg";
import React from 'react';

function Pointer(props) {
    return (
        <div className="cursor" id={props.id} style={{
            position: 'absolute',
            left: props.x,
            top: props.y,
            filter: `sepia(100%) saturate(200%) hue-rotate(${props.colorNumber}deg) opacity(0.6)`,
            width: '18px'
        }}>
            <PointerSvg />
            <span>{props.pseudo}</span>
        </div>
    );
}

export default Pointer;