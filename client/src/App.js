import './App.css'

import React, { useState } from 'react';
import Canvas from "./Components/Canvas";
import Modal from "./Components/Modal";

function App() {
    const [pseudo, setPseudo] = useState(null);
    const [pseudoModalIsOpen, setPseudoModalIsOpen] = useState((!pseudo))

    return (
        <>
            {pseudoModalIsOpen &&
                <Modal pseudo={pseudo} setPseudo={setPseudo} setPseudoModalIsOpen={setPseudoModalIsOpen}/>
            }
            <Canvas pseudo={pseudo} setPseudo={setPseudo} pseudoModalIsOpen={pseudoModalIsOpen} setPseudoModalIsOpen={setPseudoModalIsOpen} />
        </>
    );
}

export default App;
