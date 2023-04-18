import './Canvas.css';

import React, { useEffect, useState } from 'react';
import Pointer from './Pointer';
import {socket} from "../socket";

function Canvas(props) {
    const [cursors, setCursors] = useState({});

    useEffect(() => {
        socket.on('mouseMove', (json) => {
            setCursors(cursors => {
                return {
                    ...cursors,
                    [json.token]: {
                        id: json.token,
                        x: json.coordinates.x,
                        y: json.coordinates.y,
                        colorNumber: cursors[json.token] ? cursors[json.token].colorNumber : Math.floor(Math.random() * 360),
                        pseudo: (cursors[json.token]?.pseudo === json.pseudo) ? cursors[json.token].pseudo : json.pseudo
                    }
                }
            });
        });

        socket.on('userDisconnect', (token) => {
            setCursors(cursors => {
                const newCursors = { ...cursors };
                delete newCursors[token];
                return newCursors;
            });
        });

        let xMousePos = 0;
        let yMousePos = 0;
        let lastScrolledLeft = 0;
        let lastScrolledTop = 0;

        const handleMouseMove = e => {
            xMousePos = e.pageX;
            yMousePos = e.pageY;

            sendMouseMove(e.pageX, e.pageY);
        }

        const handleScroll = () => {
            const scrolledLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0; // Multiple variables for multiple browsers
            const scrolledTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            xMousePos += scrolledLeft - lastScrolledLeft;
            lastScrolledLeft = scrolledLeft;

            yMousePos += scrolledTop - lastScrolledTop;
            lastScrolledTop = scrolledTop;

            sendMouseMove(xMousePos, yMousePos);
        }

        const sendMouseMove = (x, y) => {
            if (!props.pseudoModalIsOpen)
                socket.emit('mouseMove', { pseudo: props.pseudo, coordinates: {x: x, y: y} });
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [props.pseudo, props.pseudoModalIsOpen]);

    return (
        <div>
            {!props.pseudoModalIsOpen &&
                <button className="btn btn-secondary" onClick={() => props.setPseudoModalIsOpen(true)}>Change nickname</button>
            }
            <div className="container">
                {Object.values(cursors).map(cursor => (
                    <Pointer key={cursor.id} id={cursor.id} x={cursor.x} y={cursor.y} colorNumber={cursor.colorNumber} pseudo={cursor.pseudo} />
                ))}
            </div>
        </div>
    );
}

export default Canvas;
