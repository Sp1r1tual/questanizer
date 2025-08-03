const itemEffectHandlers = {
    heal: async ({ userStats, value }) => {
        userStats.hp = Math.min(userStats.maxHp, userStats.hp + value);

        return `Healed for ${value}`;
    },
};

const handleItemEffects = async ({ userStats, effect }) => {
    if (!effect) return [];

    const results = [];
    const parsedEffect = JSON.parse(JSON.stringify(effect));

    for (const [effectType, value] of Object.entries(parsedEffect)) {
        const handler = itemEffectHandlers[effectType];

        if (handler) {
            const result = await handler({ userStats, value });

            if (result) results.push(result);
        }
    }

    return results;
};

export { handleItemEffects };
