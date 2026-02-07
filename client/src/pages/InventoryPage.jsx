import { PageContainer } from "@/components/ui/wrappers/PageContainer";
import { Card } from "@/components/ui/wrappers/Card";
import { InventoryItemView } from "@/components/inventory/InventoryItemView";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryList } from "@/components/inventory/InventoryList";

const InventoryPage = () => {
  return (
    <PageContainer>
      <InventoryItemView />

      <Card size="large">
        <UserStatsView />
      </Card>

      <Card size="large">
        <InventoryHeader />
        <InventoryList />
      </Card>
    </PageContainer>
  );
};

export { InventoryPage };
