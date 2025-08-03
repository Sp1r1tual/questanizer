import { InventoryItemModal } from "../components/inventory/modals/InventoryItemModal";
import { InventoryList } from "../components/inventory/InventoryList";
import { Dashboard } from "../components/ui/wrappers/Dashboard";
import { ContainerMedium } from "../components/ui/wrappers/ContainerMedium";
import { InventoryHeader } from "../components/inventory/InventoryHeader";
import { UserStatsView } from "../components/stats/UserStatsView";
import { Wrapper } from "../components/ui/wrappers/Wrapper";

import backgroundImg from "../assets/inventory-background.png";

import styles from "./InventoryPage.module.css";

const InventoryPage = () => {
    return (
        <div
            className={styles.inventoryWrapper}
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            <Wrapper>
                <InventoryItemModal />
                <Dashboard>
                    <ContainerMedium>
                        <UserStatsView />
                    </ContainerMedium>
                    <ContainerMedium>
                        <InventoryHeader />
                        <InventoryList />
                    </ContainerMedium>
                </Dashboard>
            </Wrapper>
        </div>
    );
};

export { InventoryPage };
