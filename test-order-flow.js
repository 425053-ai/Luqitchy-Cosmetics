#!/usr/bin/env node

/**
 * Comprehensive Order Flow Testing
 * Tests sanitization and order processing for all product types
 */

// Mock sanitization functions from API
function ultraSanitizeString(str) {
  if (str === null || str === undefined) return '';
  let s = String(str);
  
  // Remove ALL control characters
  s = s.replace(/[\x00-\x1F\x7F\x80-\x9F]/g, '');
  
  // Remove newlines, tabs, form feeds
  s = s.replace(/[\n\r\t\f\v]/g, ' ');
  
  // Collapse multiple spaces
  s = s.replace(/\s+/g, ' ');
  
  // Remove suspicious non-ASCII
  s = s.replace(/[^\x20-\x7E\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g, '');
  
  return s.trim().substring(0, 1000);
}

function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.trim().replace(/[^0-9+\-() ]/g, '').substring(0, 30);
  return ultraSanitizeString(cleaned);
}

function sanitizeProducts(products) {
  if (!Array.isArray(products)) return [];
  
  return products
    .filter(p => p && typeof p === 'object')
    .map(p => ({
      name: ultraSanitizeString(p.name),
      quantity: Math.max(0, Number(p.quantity) || 0),
      price: Math.max(0, Number(p.price) || 0),
      total: Math.max(0, Number(p.total) || 0),
    }))
    .filter(p => p.quantity > 0 && p.price > 0);
}

function sanitizeCustomer(customer) {
  if (!customer || typeof customer !== 'object') return {};
  
  const clean = {
    fullName: ultraSanitizeString(customer.fullName),
    email: ultraSanitizeString(customer.email),
    phone: ultraSanitizeString(customer.phone),
    whatsapp: ultraSanitizeString(customer.whatsapp),
    governorate: ultraSanitizeString(customer.governorate),
    city: ultraSanitizeString(customer.city),
    streetAddress: ultraSanitizeString(customer.streetAddress),
    landmark: ultraSanitizeString(customer.landmark),
    notes: ultraSanitizeString(customer.notes),
  };
  
  return JSON.parse(JSON.stringify(clean));
}

// Test products from the system
const testProducts = [
  {
    id: 'black-honey',
    name: 'Black Honey Lipstick',
    price: 250,
    quantity: 1
  },
  {
    id: 'burgundy',
    name: 'Burgundy Lipstick',
    price: 250,
    quantity: 2
  },
  {
    id: 'wine',
    name: 'Wine Lipstick',
    price: 250,
    quantity: 1
  },
  {
    id: 'strawberry-milk',
    name: 'Strawberry Milk Lipstick',
    price: 250,
    quantity: 3
  },
  {
    id: 'mocha',
    name: 'Mocha Lipstick',
    price: 250,
    quantity: 1
  },
  {
    id: 'lip-balm',
    name: 'Lip Balm 5g',
    price: 150,
    quantity: 2
  },
  {
    id: 'eyebrow-gel',
    name: 'Eyebrow Gel',
    price: 200,
    quantity: 1
  },
  {
    id: 'dri-oil',
    name: 'Dry Oil',
    price: 180,
    quantity: 1
  }
];

// Test customer data with edge cases
const testCustomers = [
  {
    fullName: 'أحمد علي',
    email: 'ahmed@test.com',
    phone: '0123456789',
    whatsapp: '0123456789',
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    streetAddress: 'شارع التحرير، 123',
    landmark: 'بجانب المدرسة',
    notes: 'من فضلك التوصيل قبل الساعة 5'
  },
  {
    fullName: 'محمد حسن\nغريب\x00\r\n',  // With control characters
    email: 'test+email@test.com',
    phone: '+20 123 456 789',
    whatsapp: '+20-123-456-789',
    governorate: 'الإسكندرية',
    city: 'الدخيلة',
    streetAddress: 'نيل\tستريت\n123',
    landmark: 'Near النيل',
    notes: 'Test\twith\ttabs'
  },
  {
    fullName: 'Emily Smith',
    email: 'emily.smith@example.com',
    phone: '(123) 456-7890',
    whatsapp: '+1-800-555-1234',
    governorate: 'Giza',
    city: 'South Giza',
    streetAddress: '456 Main Street, Apt 789',
    landmark: 'Near the mall',
    notes: 'Leave at door'
  }
];

console.log('\n' + '='.repeat(70));
console.log('🧪 COMPREHENSIVE ORDER FLOW TEST');
console.log('='.repeat(70));

// Test 1: Sanitization Functions
console.log('\n1️⃣  TESTING SANITIZATION FUNCTIONS\n');

console.log('   🔤 Testing ultraSanitizeString():');
const testStrings = [
  'Simple Name',
  'أحمد علي',
  'Name\nwith\nnewlines',
  'Name\t\twith\ttabs',
  'Control\x00chars\x1F',
  'Multiple   spaces   here',
];

testStrings.forEach(str => {
  const sanitized = ultraSanitizeString(str);
  console.log(`      ✓ "${str}" → "${sanitized}"`);
});

console.log('\n   📞 Testing sanitizePhone():');
const testPhones = [
  '0123456789',
  '+20 123 456 789',
  '+20-123-456-789',
  '(123) 456-7890',
  'Phone\x00with\x1Fcontrol',
  '+20 ABC123 XYZ', // Invalid chars should be removed
];

testPhones.forEach(phone => {
  const sanitized = sanitizePhone(phone);
  console.log(`      ✓ "${phone}" → "${sanitized}"`);
});

// Test 2: Product Sanitization
console.log('\n2️⃣  TESTING PRODUCT SANITIZATION\n');

console.log('   📦 Testing sanitizeProducts():');
const testProductsWithIssues = [
  {
    name: 'Black\nHoney\tLipstick',
    quantity: 1,
    price: 250,
    total: 250
  },
  {
    name: 'Lipstick\x00\x1F\x7F',
    quantity: 2,
    price: 250,
    total: 500
  },
  {
    name: 'Invalid\x00Product',
    quantity: 0, // Invalid quantity - should be filtered
    price: 250,
    total: 0
  },
  {
    name: 'Valid Product',
    quantity: 1,
    price: 250,
    total: 250
  }
];

const sanitizedProducts = sanitizeProducts(testProductsWithIssues);
console.log(`      ✓ Input: ${testProductsWithIssues.length} products`);
console.log(`      ✓ Output: ${sanitizedProducts.length} valid products`);
sanitizedProducts.forEach(p => {
  console.log(`        - "${p.name}" (Qty: ${p.quantity}, Price: ${p.price})`);
});

// Test 3: Customer Sanitization
console.log('\n3️⃣  TESTING CUSTOMER SANITIZATION\n');

console.log('   👤 Testing sanitizeCustomer():');
testCustomers.forEach((customer, idx) => {
  const sanitized = sanitizeCustomer(customer);
  console.log(`      ✓ Customer ${idx + 1}:`);
  console.log(`        - Name: "${sanitized.fullName}"`);
  console.log(`        - Phone: "${sanitized.phone}"`);
  console.log(`        - WhatsApp: "${sanitized.whatsapp}"`);
  console.log(`        - Address: "${sanitized.streetAddress}"`);
  console.log(`        - Notes: "${sanitized.notes}"`);
});

// Test 4: Complete Order Processing
console.log('\n4️⃣  TESTING COMPLETE ORDER PROCESSING\n');

let passedTests = 0;
let totalTests = 0;

testProducts.forEach((product, idx) => {
  totalTests++;
  console.log(`   📋 Test ${idx + 1}: ${product.name}`);
  
  const orderPayload = {
    products: [{
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      total: product.quantity * product.price
    }],
    customer: testCustomers[idx % testCustomers.length]
  };
  
  // Sanitize
  const sanitized = {
    products: sanitizeProducts(orderPayload.products),
    customer: sanitizeCustomer(orderPayload.customer)
  };
  
  // Validate (convert to boolean to avoid returning string value)
  const isValid = !!(
    sanitized.products.length > 0 &&
    sanitized.customer.fullName &&
    sanitized.customer.email &&
    sanitized.customer.phone
  );
  
  if (isValid) {
    passedTests++;
    console.log(`      ✅ PASSED - ${sanitized.products[0].name}`);
    console.log(`         Customer: ${sanitized.customer.fullName}`);
    console.log(`         Quantity: ${sanitized.products[0].quantity}`);
    console.log(`         Total: ${sanitized.products[0].total} EGP`);
  } else {
    console.log(`      ❌ FAILED - Invalid data after sanitization`);
  }
});

// Test 5: Cart Orders (Multiple Products)
console.log('\n5️⃣  TESTING CART ORDERS (MULTIPLE PRODUCTS)\n');

const cartTests = [
  [testProducts[0], testProducts[1], testProducts[2]],
  [testProducts[3], testProducts[4]],
  [testProducts[5], testProducts[6], testProducts[7]],
];

cartTests.forEach((cartItems, idx) => {
  totalTests++;
  console.log(`   🛒 Cart Test ${idx + 1}: ${cartItems.length} products`);
  
  const cartPayload = {
    products: cartItems.map(p => ({
      name: p.name,
      quantity: p.quantity,
      price: p.price,
      total: p.quantity * p.price
    })),
    customer: testCustomers[idx % testCustomers.length]
  };
  
  const sanitized = {
    products: sanitizeProducts(cartPayload.products),
    customer: sanitizeCustomer(cartPayload.customer)
  };
  
  const isValid = !!(
    sanitized.products.length > 0 &&
    sanitized.customer.fullName
  );
  
  if (isValid) {
    passedTests++;
    console.log(`      ✅ PASSED - ${sanitized.products.length} products`);
    let total = sanitized.products.reduce((sum, p) => sum + p.total, 0);
    console.log(`         Total: ${total} EGP + 70 EGP shipping`);
  } else {
    console.log(`      ❌ FAILED`);
  }
});

// Test 6: Edge Cases
console.log('\n6️⃣  TESTING EDGE CASES\n');

const edgeCases = [
  {
    name: 'Empty products',
    products: [],
    customer: testCustomers[0],
    shouldPass: false
  },
  {
    name: 'Missing customer name',
    products: [{name: 'Test', quantity: 1, price: 100, total: 100}],
    customer: {...testCustomers[0], fullName: ''},
    shouldPass: false
  },
  {
    name: 'Arabic text with control chars',
    products: [{name: 'منتج\x00\x1Fاختبار', quantity: 1, price: 100, total: 100}],
    customer: testCustomers[0],
    shouldPass: true
  },
  {
    name: 'Very long names',
    products: [{name: 'A'.repeat(1000), quantity: 1, price: 100, total: 100}],
    customer: {...testCustomers[0], fullName: 'B'.repeat(1000)},
    shouldPass: true
  }
];

edgeCases.forEach((testCase) => {
  totalTests++;
  console.log(`   ⚠️  ${testCase.name}`);
  
  const sanitized = {
    products: sanitizeProducts(testCase.products),
    customer: sanitizeCustomer(testCase.customer)
  };
  
  const isValid = !!(
    sanitized.products.length > 0 &&
    sanitized.customer.fullName
  );
  
  const meetsExpectation = isValid === testCase.shouldPass;
  
  if (meetsExpectation) {
    passedTests++;
    console.log(`      ✅ PASSED - ${testCase.shouldPass ? 'Correctly accepted' : 'Correctly rejected'}`);
  } else {
    console.log(`      ❌ FAILED - Expected ${testCase.shouldPass}, got ${isValid}`);
  }
});

// Test 7: JSON Serialization Safety
console.log('\n7️⃣  TESTING JSON SERIALIZATION SAFETY\n');

console.log(`   🔄 Testing JSON.parse(JSON.stringify()) cycle:`);

const complexOrder = {
  products: sanitizeProducts([{
    name: 'منتج\x00اختبار\nمع\tأحرف\x1Fتحكم',
    quantity: 1,
    price: 250,
    total: 250
  }]),
  customer: sanitizeCustomer(testCustomers[1])
};

try {
  const serialized = JSON.stringify(complexOrder);
  const deserialized = JSON.parse(serialized);
  totalTests++;
  passedTests++;
  console.log(`      ✅ PASSED - JSON serialization successful`);
  console.log(`         Original size: ${JSON.stringify(complexOrder).length} bytes`);
  console.log(`         Product name: "${deserialized.products[0].name}"`);
} catch (err) {
  totalTests++;
  console.log(`      ❌ FAILED - ${err.message}`);
}

// Summary
console.log('\n' + '='.repeat(70));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(70));

console.log(`\n   ✅ Passed: ${passedTests}/${totalTests}`);
console.log(`   ❌ Failed: ${totalTests - passedTests}/${totalTests}`);

if (passedTests === totalTests) {
  console.log('\n   🎉 ALL TESTS PASSED! Order flow is working correctly.\n');
  process.exit(0);
} else {
  console.log('\n   ⚠️  Some tests failed. Please review above.\n');
  process.exit(1);
}
