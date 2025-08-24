const marketItems = [
  {
    name: "healingPotion",
    description: "Restores 50 HP",
    type: "potion",
    price: 25,
    isActive: true,
    effect: {
      heal: 50,
    },
    createdAt: new Date("2023-07-25T00:00:00.000Z"),
    updatedAt: new Date("2023-07-25T00:00:00.000Z"),
    itemImg: "images/items/heal-potion-questanizer.png",
  },
];

export { marketItems };
