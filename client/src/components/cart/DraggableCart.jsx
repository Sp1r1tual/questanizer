import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";

import { useConstrainOnResize } from "@/hooks/draggable/useConstrainOnResize";

import { DraggableCartContent } from "../cart/DraggableCartContent";

import { openCartModal } from "@/store/market/marketSlice";

import { fetchCart } from "@/store/market/marketThunks";

import { constrainPosition } from "@/utils/draggable/constrainPosition";

const getInitialPosition = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 640) return { x: width - 80, y: height - 130 };
    if (width < 1024) return { x: width - 100, y: height - 120 };

    return { x: width - 130, y: height - 130 };
};

const DraggableCart = () => {
    const dispatch = useDispatch();

    const [position, setPosition] = useState(getInitialPosition());

    const { cart, isCartLoaded } = useSelector((state) => state.market);

    useEffect(() => {
        if (!isCartLoaded && (!cart || cart.length === 0)) {
            dispatch(fetchCart());
        }
    }, [dispatch, isCartLoaded, cart]);

    useConstrainOnResize(setPosition, constrainPosition);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const handleDragEnd = ({ delta }) => {
        const newPos = {
            x: position.x + delta.x,
            y: position.y + delta.y,
        };
        setPosition(constrainPosition(newPos));
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <DraggableCartContent
                x={position.x}
                y={position.y}
                onClick={() => dispatch(openCartModal())}
            />
        </DndContext>
    );
};

export { DraggableCart };
