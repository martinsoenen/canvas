import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Pointer from './Components/Pointer';

const socket = io.connect('http://localhost:3000');

function App() {
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
                        colorNumber: cursors[json.token] ? cursors[json.token].colorNumber : Math.floor(Math.random() * 360)
                    }
                }
            });
        });

        socket.on('userDisconnect', function (token) {
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

        function handleMouseMove(e) {
            xMousePos = e.pageX;
            yMousePos = e.pageY;

            socket.emit('mouseMove', { x: e.pageX, y: e.pageY });
        }

        function handleScroll() {
            const scrolledLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0; // Multiple variables for multiple browsers
            const scrolledTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

            xMousePos += scrolledLeft - lastScrolledLeft;
            lastScrolledLeft = scrolledLeft;

            yMousePos += scrolledTop - lastScrolledTop;
            lastScrolledTop = scrolledTop;

            console.log(scrolledLeft, scrolledTop, xMousePos, yMousePos)
            socket.emit('mouseMove', { x: xMousePos, y: yMousePos });
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div id="container" style={{ width: "2000px", height: "2000px" }}>
            {Object.values(cursors).map(cursor => (
                <Pointer key={cursor.id} id={cursor.id} x={cursor.x} y={cursor.y} colorNumber={cursor.colorNumber} />
            ))}
        </div>
    );
}

export default App;
