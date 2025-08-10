import { fetchUserLanguage } from "../../store/user/localizationThunks";
import { fetchFaqs } from "../../store/support/faqThunks";
import { fetchMarket } from "../../store/market/marketThunks";
import { fetchCart } from "../../store/market/marketThunks";
import { fetchBoss } from "../../store/boss/bossBattleThunks";
import { fetchInventory } from "../../store/user/inventoryThunks";

const fetchLanguage = (dispatch) => {
    dispatch(fetchUserLanguage());
    dispatch(fetchFaqs());
    dispatch(fetchMarket());
    dispatch(fetchCart());
    dispatch(fetchBoss());
    dispatch(fetchInventory());
};

export { fetchLanguage };
