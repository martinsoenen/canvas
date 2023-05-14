import './Modal.css';

import React, {useEffect} from "react";

function Modal(props) {
    const onSubmit = e => {
        e.preventDefault();

        const pseudoInput = document.getElementById('pseudoInput');
        props.setPseudo(pseudoInput.value);
        props.setPseudoModalIsOpen(false);
    }

    const onClose = () => {
        props.setPseudoModalIsOpen(false);
    }

    const onEscape = e => {
        if (e.key === "Escape")
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
                <form className="inputs-box" onSubmit={(e) => onSubmit(e)}>
                    <input type="text" id="pseudoInput" placeholder="Maverick" autoFocus/>
                    <input className="btn btn-primary" type="submit" value="Ok"/>
                </form>
            </div>
        </div>
    );
}

export default Modal;