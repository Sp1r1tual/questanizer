const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

const constrainPosition = ({ x, y }) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const size = 60;

    return {
        x: clamp(x, 0, width - size),
        y: clamp(y, 0, height - size),
    };
};

export { constrainPosition };
