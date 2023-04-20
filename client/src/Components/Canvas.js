import './Canvas.css';

import React, { useEffect, useRef, useState } from 'react';
import Pointer from './Pointer';
import {socket} from "../socket";
import {ChromePicker} from "react-color";

function Canvas(props) {
    const [cursors, setCursors] = useState({});
    const [mouseDown, setMouseDown] = useState(false);
    const [color, setColor] = useState("#000");
    const [colorPickerIsOpen, setColorPickerIsOpen] = useState(false);
    const canvasRef = useRef(null);
    const prevPoint = useRef(null);

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
            if (props.pseudoModalIsOpen) return;

            xMousePos = e.pageX;
            yMousePos = e.pageY;

            sendMouseMove(e.pageX, e.pageY);

            if (mouseDown) {
                const currentPoint = computePointInCanvas(e);

                const ctx = canvasRef.current?.getContext('2d');
                if (!ctx || !currentPoint) return;

                drawLine(prevPoint.current, currentPoint, ctx)

                prevPoint.current = currentPoint
            }
        }

        const handleScroll = () => {
            if (props.pseudoModalIsOpen) return;

            const scrolledLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0; // Multiple variables for multiple browsers
            const scrolledTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            xMousePos += scrolledLeft - lastScrolledLeft;
            lastScrolledLeft = scrolledLeft;

            yMousePos += scrolledTop - lastScrolledTop;
            lastScrolledTop = scrolledTop;

            sendMouseMove(xMousePos, yMousePos);
        }

        const sendMouseMove = (x, y) => {
            socket.emit('mouseMove', { pseudo: props.pseudo, coordinates: {x: x, y: y} });
        }

        // Event listeners

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mouseup', handleMouseUp);
        };

    }, [props.pseudo, props.pseudoModalIsOpen, canvasRef, prevPoint, mouseDown, colorPickerIsOpen]);

    const handleMouseDown = () => setMouseDown(true);

    const handleMouseUp = () => {
        setMouseDown(false);
        prevPoint.current = null;
    }

    const computePointInCanvas = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Currently rect is not important, but I prepare it if I want to reduce the canvas size one day
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        return {x, y};
    }

    const drawLine = (prevPoint, currentPoint, ctx) => {
        const lineColor = color;
        const lineWidth = 5;

        let startPoint = prevPoint ?? currentPoint;

        ctx.beginPath()
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = lineColor
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(currentPoint.x, currentPoint.y)
        ctx.stroke()

        ctx.fillStyle = lineColor
        ctx.beginPath()
        ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
        ctx.fill()
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div>
            {!props.pseudoModalIsOpen &&
                <div>
                    <button className="btn btn-secondary" onClick={() => props.setPseudoModalIsOpen(true)}>Change nickname</button>
                    <button className="btn btn-secondary" onClick={() => setColorPickerIsOpen(true)}>Change color</button>
                    <button className="btn btn-secondary" onClick={clearCanvas}>Clear canvas</button>
                </div>
            }
            {colorPickerIsOpen ?
                <div className="color-picker-div">
                    <div className="color-picker-background" onClick={() => setColorPickerIsOpen(false)}></div>
                    <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
                </div>
                : null
            }
            <canvas ref={canvasRef} onMouseDown={handleMouseDown} className="fixed" width={2000} height={2000} style={{zIndex:"-1"}}></canvas>
            <div onMouseDown={handleMouseDown} className="fixed container" style={{zIndex:"-1"}}>
                {Object.values(cursors).map(cursor => (
                    <Pointer key={cursor.id} id={cursor.id} x={cursor.x} y={cursor.y} colorNumber={cursor.colorNumber} pseudo={cursor.pseudo} />
                ))}
            </div>
        </div>
    );
}

export default Canvas;
