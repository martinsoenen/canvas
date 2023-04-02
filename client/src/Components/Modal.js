import './Modal.css';

import React, {useEffect} from "react";

function Modal(props) {
    function onClick() {
        const pseudoInput = document.getElementById('pseudoInput');
        props.setPseudo(pseudoInput.value);
        props.setPseudoModalIsOpen(false);
    }

    function onClose() {
        props.setPseudoModalIsOpen(false);
    }

    function onEscape(event) {
        if (event.key === "Escape")
            props.setPseudoModalIsOpen(false);
    }

    useEffect(() => {
        if (props.pseudo)
            document.addEventListener("keydown", onEscape);

        return () => document.removeEventListener("keydown", onEscape);
    })

    return (
        <div className="modal">
            <div className="modal-content">
                { props.pseudo &&
                    <span className="close" onClick={() => onClose()}>&times;</span>
                }
                <h4>What is your nickname ?</h4>
                <form className="inputs-box">
                    <input type="text" id="pseudoInput" placeholder="Maverick"/>
                    <input className="btn btn-primary" type="button" value="Ok" onClick={() => onClick()}/>
                </form>
            </div>
        </div>
    );
}

export default Modal;