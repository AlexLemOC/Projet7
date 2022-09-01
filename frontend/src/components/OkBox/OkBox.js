import React from "react";

// Icons
import ok from "../../images/ok-icon.svg";

// Components
import ChoiceBox from "../ChoiceBox/ChoiceBox";
import UIBtn from "../Buttons/UIBtn/UIBtn";

// Styles
import styles from "./OkBox.module.css";

const OkBox = (props) => {
    return (
        <ChoiceBox
            show={props.show}
            onCancel={props.onCancel}
            // header="titre du modal"
            footer={
                <UIBtn
                    id="accept-btn"
                    name="Ok"
                    type="submit"
                    btnType="warning"
                    onClick={props.onCancel}
                    buttonClass={styles.btn}
                />
            }
        >
            <img className={`${styles.okIcon} icon_green`} src={ok} alt="" />
            <p>{props.message}</p>
        </ChoiceBox>
    );
};

export default OkBox;