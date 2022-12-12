import React, { useEffect, useState } from "react";

/**
 * **useDataLoadState**
 * 
 * 데이터를 불러오는 상태를 관리하는 hook 
 * 
 * **출력**
 * 
 * [loading, state, setState]
 * 
 * @template T
 * @param {() => Promise<T>} getDataFunc
 * @param {any[]} deps
 * @returns {readonly [boolean, T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>]}
 */
export const useDataLoadState = <T>(getDataFunc: () => Promise<T>, deps: any[]): readonly [boolean, T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] => {
    const [loading, setLoading] = useState<boolean>(true);
    const [state, setState] = useState<T>()

    useEffect(() => {
        setState(undefined);
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await getDataFunc();
                setState(res);
            } catch (e) {
                setLoading(false);
                console.error(e);
            }
            setLoading(false);
        })()
    }, deps);

    return [loading, state, setState] as const;
}