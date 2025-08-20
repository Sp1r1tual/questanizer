import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { MarketItemView } from "@/components/market/MarketItemView";
import { DraggableCart } from "@/components/cart/DraggableCart";
import { CartView } from "@/components/cart/CartView";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { Container } from "@/components/ui/wrappers/Container";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { MarketBanner } from "@/components/market/MarketBanner";
import { MarketHeader } from "@/components/market/MarketHeader";
import { MarketList } from "@/components/market/MarketList";

import backgroundImg from "@/assets/market-background.png";

import styles from "./MarketPage.module.css";

const MarketPage = () => {
  return (
    <div className={styles.marketWrapper} style={{ backgroundImage: `url(${backgroundImg})` }}>
      <Wrapper>
        <MarketItemView />
        <DraggableCart />
        <CartView />
        <Dashboard>
          <Container>
            <UserStatsView />
          </Container>
          <Container>
            <MarketBanner />
            <MarketHeader />
            <MarketList />
          </Container>
        </Dashboard>
      </Wrapper>
    </div>
  );
};

export { MarketPage };
