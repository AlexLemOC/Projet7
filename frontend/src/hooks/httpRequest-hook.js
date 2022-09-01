import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpRequest = () => {
    // useState le chargement et les erreurs
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeRequest = useRef([]);

    // Fonction fetch avec callBack pour ne pas boucler le fetch
    const sendRequest = useCallback(async (url, method = "", body = null, headers = {}) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeRequest.current.push(httpAbortCtrl);

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal,
            });

            const responseData = await response.json();

            activeRequest.current = activeRequest.current.filter((reqCtrl) => reqCtrl !== httpAbortCtrl);

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            // Si il ne load pas, on envoie les datas
            setIsLoading(false);
            return responseData;
        } catch (err) {
            // Si erreur, afficher le message d'erreur
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    }, []);

    const clearError = () => {
        setError(null);
    };

    // Annule la requête
    useEffect(() => {
        return () => {
            activeRequest.current.forEach((abortCtrl) => abortCtrl.abort());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};