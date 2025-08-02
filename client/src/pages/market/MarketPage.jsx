import { ContainerLarge } from "../../components/ui/wrappers/ContainerLarge";
import { Dashboard } from "../../components/ui/wrappers/Dashboard";
import { MarketBanner } from "./components/MarketBanner";
import { MarketList } from "./components/MarketList";
import { MarketHeader } from "./components/MarketHeader";
import { UserStatsView } from "../../components/stats/UserStatsView";
import { MarketItemModal } from "./components/MarketItemModal";
import { DraggableCart } from "./components/cart/DraggableCart";
import { CartModal } from "./components/cart/CartModal";

const MarketPage = () => {
    return (
        <>
            <MarketItemModal />
            <DraggableCart />
            <CartModal />
            <Dashboard>
                <ContainerLarge>
                    <UserStatsView />
                </ContainerLarge>
                <ContainerLarge>
                    <MarketBanner />
                    <MarketHeader />
                    <MarketList />
                </ContainerLarge>
            </Dashboard>
        </>
    );
};

export { MarketPage };
