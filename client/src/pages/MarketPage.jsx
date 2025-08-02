import { ContainerLarge } from "../components/ui/wrappers/ContainerLarge";
import { Dashboard } from "../components/ui/wrappers/Dashboard";
import { MarketBanner } from "../components/market/MarketBanner";
import { MarketList } from "../components/market/MarketList";
import { MarketHeader } from "../components/market/MarketHeader";
import { UserStatsView } from "../components/stats/UserStatsView";
import { MarketItemModal } from "../components/market/modals/MarketItemModal";
import { DraggableCart } from "../components/cart/DraggableCart";
import { CartModal } from "../components/cart/modals/CartModal";

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
