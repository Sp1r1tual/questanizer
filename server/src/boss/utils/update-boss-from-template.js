const updateBossFromTemplate = (boss, template) => {
    boss.bossId = template.bossId;
    boss.bossName = template.bossName;
    boss.healthPoints = template.healthPoints;
    boss.maxHealthPoints = template.healthPoints;
    boss.bossPower = template.bossPower;
    boss.bossRewardExp = template.bossRewardExp;
    boss.bossRageBar = template.bossRageBar;
    boss.bossImg = template.bossImg;
};

export { updateBossFromTemplate };
