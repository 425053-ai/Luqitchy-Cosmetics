#!/usr/bin/env node

/**
 * Test Order Creation Flow
 * Tests complete order creation with all notifications
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

const testOrders = [
  {
    name: 'Test Customer 1',
    email: 'test1@example.com',
    phone: '01001234567',
    product: 'Lipstick Red',
  },
  {
    name: 'Test Customer 2',
    email: 'test2@example.com',
    phone: '01002345678',
    product: 'Mascara Black',
  },
  {
    name: 'Test Customer 3',
    email: 'test3@example.com',
    phone: '01003456789',
    product: 'Foundation Light',
  },
];

async function createTestOrder(index, orderData) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 TEST ORDER ${index + 1}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📦 Product: ${orderData.product}`);
  console.log(`👤 Customer: ${orderData.name}`);
  console.log(`📧 Email: ${orderData.email}`);
  console.log(`📱 Phone: ${orderData.phone}`);

  try {
    // Create a simple placeholder image (1x1 pixel JPEG in base64)
    const placeholderImage = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8VAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';

    const orderPayload = {
      products: [{
        name: orderData.product,
        quantity: 1,
        price: 250,
        total: 250,
      }],
      customer: {
        fullName: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        whatsapp: orderData.phone,
        governorate: 'القاهرة',
        city: 'المقطم',
        streetAddress: 'شارع الاختبار',
        landmark: 'بجانب المتجر',
        notes: 'طلب اختبار',
      },
      imageData: placeholderImage,
      transferImageMime: 'image/jpeg',
      sessionId: `test-session-${Date.now()}`,
    };

    console.log(`\n📤 Sending order request to /api/create-order...`);
    const response = await fetch(`${BASE_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    const result = await response.json();

    console.log(`\n✅ Response Status: ${response.status}`);
    console.log(`📋 Order ID: ${result.orderId || result.orderNumber}`);
    console.log(`🔢 Order Number: ${result.orderNumber}`);
    console.log(`✔️ Success: ${result.success}`);

    if (result.fallback) {
      console.log(`⚠️ Using fallback order processing`);
    }

    // Extract numeric part from order ID
    const orderNumber = typeof result.orderNumber === 'string' 
      ? parseInt(result.orderNumber.replace('ORD-', ''))
      : result.orderNumber;

    return {
      orderId: result.orderId || result.orderNumber,
      orderNumber: orderNumber,
      success: result.success,
    };
  } catch (error) {
    console.error(`❌ Error creating order:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('\n');
  console.log('█'.repeat(60));
  console.log('  🧪 COMPLETE ORDER CREATION TEST SUITE');
  console.log('█'.repeat(60));
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`📅 Test Date: ${new Date().toLocaleString()}\n`);

  const results = [];

  for (let i = 0; i < testOrders.length; i++) {
    const result = await createTestOrder(i, testOrders[i]);
    if (result) {
      results.push(result);
    }

    // Wait 1 second between orders
    if (i < testOrders.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 TEST SUMMARY');
  console.log(`${'='.repeat(60)}`);

  if (results.length > 0) {
    console.log(`\n✅ Orders Created: ${results.length}\n`);

    for (let i = 0; i < results.length; i++) {
      console.log(`Order ${i + 1}: ${results[i].orderId} (Number: ${results[i].orderNumber})`);
    }

    // Check if sequential
    console.log(`\n🔍 Sequential Check:`);
    let isSequential = true;
    for (let i = 1; i < results.length; i++) {
      const prev = results[i - 1].orderNumber;
      const curr = results[i].orderNumber;
      const isNext = curr === prev + 1;
      console.log(`  ${results[i - 1].orderId} (${prev}) → ${results[i].orderId} (${curr}): ${isNext ? '✅' : '❌'}`);
      if (!isNext) isSequential = false;
    }

    if (isSequential && results.length > 1) {
      console.log(`\n✨ SUCCESS: All orders are sequential!`);
    } else {
      console.log(`\n⚠️ WARNING: Orders are not sequential!`);
    }
  } else {
    console.log(`❌ No orders were created successfully`);
  }

  console.log(`\n${'='.repeat(60)}\n`);
}

runTests()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
