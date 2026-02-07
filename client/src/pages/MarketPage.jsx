import { PageContainer } from "@/components/ui/wrappers/PageContainer";
import { Card } from "@/components/ui/wrappers/Card";
import { MarketItemView } from "@/components/market/MarketItemView";
import { DraggableCart } from "@/components/cart/DraggableCart";
import { CartView } from "@/components/cart/CartView";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { MarketBanner } from "@/components/market/MarketBanner";
import { MarketHeader } from "@/components/market/MarketHeader";
import { MarketList } from "@/components/market/MarketList";

const MarketPage = () => {
  return (
    <PageContainer>
      <MarketItemView />
      <DraggableCart />
      <CartView />

      <Card size="large">
        <UserStatsView />
      </Card>

      <Card size="large">
        <MarketBanner />
        <MarketHeader />
        <MarketList />
      </Card>
    </PageContainer>
  );
};

export { MarketPage };
