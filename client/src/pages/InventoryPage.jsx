import { Wrapper } from "@/components/ui/wrappers/Wrapper";
import { InventoryItemView } from "@/components/inventory/InventoryItemView";
import { Dashboard } from "@/components/ui/wrappers/Dashboard";
import { Container } from "@/components/ui/wrappers/Container";
import { UserStatsView } from "@/components/stats/UserStatsView";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryList } from "@/components/inventory/InventoryList";

import backgroundImg from "@/assets/inventory-background.png";

import styles from "./InventoryPage.module.css";

const InventoryPage = () => {
  return (
    <div className={styles.inventoryWrapper} style={{ backgroundImage: `url(${backgroundImg})` }}>
      <Wrapper>
        <InventoryItemView />
        <Dashboard>
          <Container>
            <UserStatsView />
          </Container>
          <Container>
            <InventoryHeader />
            <InventoryList />
          </Container>
        </Dashboard>
      </Wrapper>
    </div>
  );
};

export { InventoryPage };
