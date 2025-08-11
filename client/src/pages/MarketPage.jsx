import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { MarketItemModal } from "@/components/market/modals/MarketItemModal";
import { DraggableCart } from "@/components/cart/DraggableCart";
import { CartModal } from "@/components/cart/modals/CartModal";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { ContainerMedium } from "@/components/ui/wrappers/ContainerMedium";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { MarketBanner } from "@/components/market/MarketBanner";
import { MarketHeader } from "@/components/market/MarketHeader";
import { MarketList } from "@/components/market/MarketList";

import backgroundImg from "@/assets/market-background.png";

import styles from "./MarketPage.module.css";

const MarketPage = () => {
    return (
        <div
            className={styles.marketWrapper}
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            <Wrapper>
                <MarketItemModal />
                <DraggableCart />
                <CartModal />
                <Dashboard>
                    <ContainerMedium>
                        <UserStatsView />
                    </ContainerMedium>
                    <ContainerMedium>
                        <MarketBanner />
                        <MarketHeader />
                        <MarketList />
                    </ContainerMedium>
                </Dashboard>
            </Wrapper>
        </div>
    );
};

export { MarketPage };
