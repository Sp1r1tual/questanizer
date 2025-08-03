import { InventoryItemModal } from "../components/inventory/modals/InventoryItemModal";
import { InventoryList } from "../components/inventory/InventoryList";
import { Dashboard } from "../components/ui/wrappers/Dashboard";
import { ContainerLarge } from "../components/ui/wrappers/ContainerLarge";
import { InventoryHeader } from "../components/inventory/InventoryHeader";
import { UserStatsView } from "../components/stats/UserStatsView";

const InventoryPage = () => {
    return (
        <>
            <InventoryItemModal />
            <Dashboard>
                <ContainerLarge>
                    <UserStatsView />
                </ContainerLarge>
                <ContainerLarge>
                    <InventoryHeader />
                    <InventoryList />
                </ContainerLarge>
            </Dashboard>
        </>
    );
};

export { InventoryPage };
