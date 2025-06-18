import robberWolf from "../assets/boss-02.png";
import evilWizardImg from "../assets/boss-01.png";

const bosses = [
    {
        bossId: 1,
        bossName: "Robber Wolf",
        healthPoints: 100,
        bossPower: 15,
        bossRewardExp: 150,
        bossRageBar: 5,
        bossImg: robberWolf,
    },
    {
        bossId: 2,
        bossName: "Evil Wizard",
        healthPoints: 125,
        bossPower: 20,
        bossRewardExp: 250,
        bossRageBar: 3,
        bossImg: evilWizardImg,
    },
];

export default bosses;
