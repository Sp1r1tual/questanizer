const itemEffectHandlers = {
    heal: async ({ userStats, value }) => {
        userStats.hp = Math.min(userStats.maxHp, userStats.hp + value);

        return `Healed for ${value}`;
    },
};

const handleItemEffects = async ({ userStats, effect }) => {
    if (!effect) return [];

    const messages = [];
    const stringifyEffect = JSON.parse(JSON.stringify(effect));

    for (const [effectKey, value] of Object.entries(stringifyEffect)) {
        const handler = itemEffectHandlers[effectKey];

        const result = await handler({ userStats, value });

        if (result) messages.push(result);
    }

    return messages;
};

export { handleItemEffects };
