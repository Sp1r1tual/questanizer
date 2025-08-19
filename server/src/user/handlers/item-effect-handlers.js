const itemEffectHandlers = {
  heal: ({ userStats, value }) => {
    userStats.hp = Math.min(userStats.maxHp, userStats.hp + value);
  },
};

const handleItemEffects = async ({ userStats, effect, userId }) => {
  if (!effect) return [];

  const results = [];
  const parsedEffect = JSON.parse(JSON.stringify(effect));

  for (const [effectType, value] of Object.entries(parsedEffect)) {
    const handler = itemEffectHandlers[effectType];

    if (handler) {
      const result = await handler({ userStats, value, userId });

      if (result) results.push(result);
    }
  }

  return results;
};

export { handleItemEffects };
