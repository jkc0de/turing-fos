module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Food",
      [
        {
          itemName: "Pizza",
          itemPrice: 9.99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          itemName: "Burger",
          itemPrice: 5.99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          itemName: "Pasta",
          itemPrice: 7.99,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Food", null, {});
  },
};
