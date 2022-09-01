import React from "react";

// Components
import Choice from "../ChoiceBox/ChoiceBox";
import UIBtn from "../Buttons/UIBtn/UIBtn";

// Styles
import styles from "./ErrorBox.module.css";

const ErrorBox = (props) => {
    return (
        <Choice
            onCancel={props.onClear}
            header="An Error Occurred!"
            show={!!props.error}
            footer={
                <UIBtn
                    id="accept-btn"
                    name="Ok"
                    type="submit"
                    btnType="warning"
                    onClick={props.onClear}
                    buttonClass={styles.btn}
                />
            }
        >
            <p>{props.error}</p>
        </Choice>
    );
};

export default ErrorBox;