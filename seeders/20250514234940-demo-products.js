'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Smartphone XYZ',
        description: 'Latest generation smartphone',
        sku: 'PHONE-001',
        price: 1299.99,
        qr_text: 'PHONE-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Notebook ABC',
        description: 'Lightweight and powerful notebook',
        sku: 'NOTE-002',
        price: 2499.99,
        qr_text: 'NOTE-002',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tablet 10"',
        description: 'Tablet with 10-inch display',
        sku: 'TAB-003',
        price: 899.99,
        qr_text: 'TAB-003',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-canceling wireless headphones',
        sku: 'AUDIO-004',
        price: 349.99,
        qr_text: 'AUDIO-004',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Smart Watch Pro',
        description: 'Fitness and health tracking smartwatch',
        sku: 'WATCH-005',
        price: 299.99,
        qr_text: 'WATCH-005',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Digital Camera 4K',
        description: 'Professional 4K digital camera with zoom lens',
        sku: 'CAM-006',
        price: 1199.99,
        qr_text: 'CAM-006',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};