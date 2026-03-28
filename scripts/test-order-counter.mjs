#!/usr/bin/env node

/**
 * Test Order Counter System
 * Verifies sequential Order ID generation
 * 
 * Usage:
 *   node scripts/test-order-counter.mjs
 *   OR from project root: pnpm test:counter
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testOrderCounter() {
  console.log('🧪 ORDER COUNTER TEST SUITE');
  console.log('═'.repeat(60));
  console.log(`Base URL: ${BASE_URL}\n`);

  try {
    // Test 1: Get current counter
    console.log('📊 TEST 1: Get current counter');
    const getCurrentRes = await fetch(`${BASE_URL}/api/orderCounter`, {
      method: 'GET',
    });

    if (!getCurrentRes.ok) {
      throw new Error(`Failed to get counter: ${getCurrentRes.status}`);
    }

    const getCurrentData = await getCurrentRes.json();
    const currentCounter = getCurrentData.currentOrder;
    const currentOrderId = getCurrentData.orderId;

    console.log(`  ✅ Current Counter: ${currentCounter}`);
    console.log(`  ✅ Current Order ID: ${currentOrderId}`);
    console.log();

    // Test 2: Generate next 3 Order IDs
    console.log('⏫ TEST 2: Generate 3 sequential Order IDs');
    const generatedIds = [];
    
    for (let i = 1; i <= 3; i++) {
      const postRes = await fetch(`${BASE_URL}/api/orderCounter`, {
        method: 'POST',
      });

      if (!postRes.ok) {
        throw new Error(`Failed to generate Order ID ${i}: ${postRes.status}`);
      }

      const postData = await postRes.json();
      const orderId = postData.orderId;
      const orderNumber = postData.orderNumber;

      generatedIds.push(orderId);
      console.log(`  ✅ Order ${i}: ${orderId} (counter: ${orderNumber})`);
    }
    console.log();

    // Test 3: Verify sequential
    console.log('✔️ TEST 3: Verify sequential numbering');
    let isSequential = true;
    for (let i = 1; i < generatedIds.length; i++) {
      const prev = parseInt(generatedIds[i - 1].replace('ORD-', ''));
      const curr = parseInt(generatedIds[i].replace('ORD-', ''));
      
      if (curr === prev + 1) {
        console.log(`  ✅ ${generatedIds[i - 1]} → ${generatedIds[i]} (sequential)`);
      } else {
        console.log(`  ❌ ${generatedIds[i - 1]} → ${generatedIds[i]} (NOT sequential!)`);
        isSequential = false;
      }
    }
    console.log();

    // Test 4: Verify format
    console.log('📋 TEST 4: Verify Order ID format');
    const formatRegex = /^ORD-\d{4}$/;
    let formatValid = true;
    for (const id of generatedIds) {
      if (formatRegex.test(id)) {
        console.log(`  ✅ Format valid: ${id}`);
      } else {
        console.log(`  ❌ Format invalid: ${id}`);
        formatValid = false;
      }
    }
    console.log();

    // Test 5: Verify no timestamp-like IDs
    console.log('⏰ TEST 5: Verify no timestamp-based IDs');
    let noTimestamps = true;
    for (const id of generatedIds) {
      const num = parseInt(id.replace('ORD-', ''));
      if (num > 9999) {
        console.log(`  ❌ Timestamp-based ID detected: ${id} (${num})`);
        noTimestamps = false;
      }
    }
    if (noTimestamps) {
      console.log(`  ✅ No timestamp-based IDs found`);
    }
    console.log();

    // Results
    console.log('═'.repeat(60));
    console.log('📊 TEST RESULTS:');
    console.log(`  Sequential: ${isSequential ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Format Valid: ${formatValid ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  No Timestamps: ${noTimestamps ? '✅ PASS' : '❌ FAIL'}`);
    console.log();

    if (isSequential && formatValid && noTimestamps) {
      console.log('🎉 ALL TESTS PASSED!');
      return true;
    } else {
      console.log('❌ SOME TESTS FAILED');
      return false;
    }
  } catch (error) {
    console.error('💥 Test Error:', error.message);
    console.log('\n⚠️ Make sure the development server is running:');
    console.log('   pnpm dev');
    return false;
  }
}

// Run tests
testOrderCounter()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
