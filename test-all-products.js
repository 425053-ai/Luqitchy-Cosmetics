const products = [
  { id: "black-honey", name: "Lipgloss Black Honey", price: 99 },
  { id: "burgundy", name: "Lipgloss Burgundy", price: 99 },
  { id: "wine", name: "Lipgloss Wine", price: 99 },
  { id: "mocha", name: "Lipgloss Mocha", price: 99 },
  { id: "strawberry-milk", name: "Strawberry Milk", price: 99 },
  { id: "lip-balm", name: "Lip Balm", price: 100 },
  { id: "eyebrow-gel-10g", name: "Eyebrow Gel 10g", price: 60 },
  { id: "eyebrow-gel-20g", name: "Eyebrow Gel 20g", price: 115 },
  { id: "creamy-blusher", name: "Creamy Blusher", price: 95 },
  { id: "dri-oil", name: "Dry Oil", price: 250 },
  { id: "body-care-strawberry", name: "Body Care", price: 199 },
  { id: "lipgloss-lotion-offer", name: "3 Lipglosses + Lotion", price: 199 },
];

const customerData = {
  fullName: "أحمد محمد",
  email: "test@test.com",
  phone: "201234567890",
  whatsapp: "201234567890",
  governorate: "Cairo",
  city: "Helwan",
  streetAddress: "Street 1, Building 5",
  landmark: "Near Metro Station",
  notes: "اختبار شامل",
};

async function testProductOrder(product) {
  const orderPayload = {
    products: [{
      name: product.name,
      quantity: 1,
      price: product.price,
      total: product.price,
    }],
    customer: {
      fullName: customerData.fullName,
      email: customerData.email,
      phone: customerData.phone,
      whatsapp: customerData.whatsapp,
      governorate: customerData.governorate,
      city: customerData.city,
      streetAddress: customerData.streetAddress,
      landmark: customerData.landmark,
      notes: customerData.notes,
    },
    sessionId: `test-${product.id}-${Date.now()}`,
  };

  try {
    // Step 1: Create order
    console.log(`\n📋 اختبار ${product.name} (${product.price} EGP)`);
    console.log("⏳ جاري إنشاء الطلب...");
    
    const createResponse = await fetch("http://localhost:3000/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: orderPayload.products, customer: orderPayload.customer }),
    });

    if (!createResponse.ok) {
      throw new Error(`خطأ في الإنشاء: ${createResponse.status}`);
    }

    const createResult = await createResponse.json();
    if (!createResult.success || !createResult.orderNumber) {
      throw new Error("فشل في إنشاء الطلب");
    }

    const orderId = createResult.orderNumber;
    console.log(`✅ تم إنشاء الطلب: ${orderId}`);

    // Step 2: Send order notifications
    console.log("⏳ جاري إرسال الإشعارات...");
    
    const notifyResponse = await fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: orderId,
        order_date: new Date().toLocaleString("ar-EG"),
        order_type: "single_product",
        customer_name: orderPayload.customer.fullName,
        customer_email: orderPayload.customer.email,
        phone: orderPayload.customer.phone,
        whatsapp: orderPayload.customer.whatsapp,
        products: orderPayload.products,
        total_amount: product.price + 70,
        governorate: orderPayload.customer.governorate,
        city: orderPayload.customer.city,
        street: orderPayload.customer.streetAddress,
        landmark: orderPayload.customer.landmark,
        notes: orderPayload.customer.notes,
        payment_method: "bank_transfer",
      }),
    });

    if (!notifyResponse.ok) {
      throw new Error(`خطأ في الإشعارات: ${notifyResponse.status}`);
    }

    const notifyResult = await notifyResponse.json();
    if (!notifyResult.success) {
      throw new Error("فشل في إرسال الإشعارات");
    }

    console.log(`✅ تم إرسال الإشعارات بنجاح`);
    console.log(`   💰 الإجمالي: ${product.price + 70} EGP`);
    console.log(`   📧 البريد: ${orderPayload.customer.email}`);
    console.log(`   🤖 التليجرام: تم الإرسال`);
    
    return { success: true, orderId, product: product.name };
  } catch (error) {
    console.error(`❌ خطأ في ${product.name}: ${error.message}`);
    return { success: false, product: product.name, error: error.message };
  }
}

async function runTests() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║      اختبار شامل لجميع منتجات Luqitchy Cosmetics      ║");
  console.log("╚════════════════════════════════════════════════════════╝");

  const results = [];
  
  for (const product of products) {
    const result = await testProductOrder(product);
    results.push(result);
    
    // تأخير بين الطلبات لتجنب الاختناقات
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║                    ملخص النتائج                      ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ نجح: ${successful.length}/${results.length}`);
  if (successful.length > 0) {
    successful.forEach(r => console.log(`   • ${r.product} → ${r.orderId}`));
  }

  if (failed.length > 0) {
    console.log(`\n❌ فشل: ${failed.length}/${results.length}`);
    failed.forEach(r => console.log(`   • ${r.product}: ${r.error}`));
  }

  console.log("\n" + "═".repeat(56));
  if (failed.length === 0) {
    console.log("✨ جميع الطلبات نجحت! النظام يعمل بكفاءة تامة!");
  } else {
    console.log(`⚠️ حل ${failed.length} مشكلة قبل الإطلاق`);
  }
  console.log("═".repeat(56));
}

runTests().catch(console.error);
