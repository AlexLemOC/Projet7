import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
    // L'action sera de préciser le changement d'état de l'input
    switch (action.type) {
        case "INPUT_CHANGE":
            let formIsValid = true;
            // Validation pour chaque objet html, il valide avec l'id et le changement d'état de l'objet
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            // Renvoie l'état actuel et l'actualise avec les nouvelles informations tapées dans le champs (input, value)
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid },
                },
                isValid: formIsValid,
            };
        case "SET_DATA":
            return {
                inputs: action.inputs,
                isValid: action.formIsValid,
            };
        default:
            return state;
    }
};

// Composant à exporter pour l'utilisation des formulaires
export const useForm = (initialInputs, initialFormValidity) => {
    // formState à l'état initial 
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    // formState foncionnant comme une eventListener pour capter les inputs
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: "INPUT_CHANGE",
            value: value,
            isValid: isValid,
            inputId: id,
        });
    }, []);

    // formState pour récupérer les infos finales
    const setFormState = useCallback((inputData, formValidity) => {
        dispatch({
            type: "SET_DATA",
            inputs: inputData,
            formIsValid: formValidity,
        });
    }, []);

    return [formState, inputHandler, setFormState];
};