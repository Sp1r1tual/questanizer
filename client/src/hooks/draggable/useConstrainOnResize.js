import { useEffect } from "react";

const useConstrainOnResize = (setPosition, constrainFn) => {
    useEffect(() => {
        const handleResize = () => {
            setPosition((prev) => constrainFn(prev));
        };

        let timeout;

        const debounced = () => {
            clearTimeout(timeout);
            timeout = setTimeout(handleResize, 150);
        };

        window.addEventListener("resize", debounced);

        return () => {
            window.removeEventListener("resize", debounced);
            clearTimeout(timeout);
        };
    }, [setPosition, constrainFn]);
};

export { useConstrainOnResize };
