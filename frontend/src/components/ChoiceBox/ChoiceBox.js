import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

//Styles
import styles from "./ChoiceBox.module.css";

const ChoiceBoxOverlay = (props) => {
    const content = (
        <div className={`${styles.choiceBox} ${props.className}`} style={props.style}>
            {/* <header className={`${styles.choiceBox__header} ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header> */}
            <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
                <div className={`${styles.choiceBox__content} ${props.contentClass}`}>{props.children}</div>
                <footer className={`${styles.choiceBox__footer} ${props.footerClass}`}>{props.footer}</footer>
            </form>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById("choiceBox-hook"));
};

const Backdrop = (props) => {
    // Portail référencé sur l'html principal comme "Backdrop-hook"
    return ReactDOM.createPortal(
        <div className={styles.backdrop} onClick={props.onClick}></div>,
        document.getElementById("backdrop-hook")
    );
};

const ChoiceBox = (props) => {
    return (
        <>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={10} classNames={styles.choiceBox}>
                <ChoiceBoxOverlay {...props} />
            </CSSTransition>
        </>
    );
};

export default ChoiceBox;