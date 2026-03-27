// Example: Product Page Integration with New Order System
"use client";

import React, { useState } from "react";
import { useOrderManager } from "@/hooks/use-order-manager";

interface ProductPageProps {
  productName: string;
  productPrice: number;
  productId: string;
}

export default function ExampleProductPage({
  productName,
  productPrice,
  productId
}: ProductPageProps) {
  const { createOrder, isLoading, error, success, lastOrder } = useOrderManager();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    quantity: 1,
    paymentMethod: "cash",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return; // Prevent double submission

    // Validation
    if (!formData.name || !formData.phone || !formData.address) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    // Create order
    const order = await createOrder({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      email: formData.email,
      productName,
      productPrice,
      quantity: parseInt(formData.quantity.toString()) || 1,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    });

    if (order) {
      // ✨ Success - reset form or show confirmation
      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        quantity: 1,
        paymentMethod: "cash",
        notes: ""
      });

      alert(`✅ تم إنشاء الطلب برقم: ${order.formattedOrderNumber}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.productInfo}>
        <h2>{productName}</h2>
        <p style={styles.price}>{productPrice} ريال</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>📋 نموذج الطلب</h3>

        <div style={styles.formGroup}>
          <label>الاسم *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="أدخل الاسم الكامل"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>رقم الهاتف *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="أدخل رقم الهاتف"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>العنوان *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="أدخل العنوان بالتفصيل"
            style={{ ...styles.input, minHeight: "80px" }}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="أدخل البريد الإلكتروني"
            style={styles.input}
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label>الكمية</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label>طريقة الدفع</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="cash">الدفع عند الاستلام</option>
              <option value="bank">تحويل بنكي</option>
              <option value="online">دفع إلكتروني</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label>ملاحظات</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="أي ملاحظات إضافية"
            style={{ ...styles.input, minHeight: "60px" }}
          />
        </div>

        {error && <p style={styles.error}>❌ {error}</p>}
        {success && lastOrder && (
          <p style={styles.success}>✅ تم إنشاء الطلب بنجاح: {lastOrder.formattedOrderNumber}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.submitButton,
            opacity: isLoading ? 0.6 : 1,
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "جاري الطلب..." : "🛒 اطلب الآن"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    direction: "rtl"
  } as React.CSSProperties,
  productInfo: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center" as any
  } as React.CSSProperties,
  price: {
    fontSize: "24px",
    color: "#28A745",
    fontWeight: "bold",
    margin: "10px 0 0 0"
  } as React.CSSProperties,
  form: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  } as React.CSSProperties,
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column"
  } as React.CSSProperties,
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  } as React.CSSProperties,
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    marginTop: "5px",
    direction: "rtl"
  } as React.CSSProperties,
  error: {
    color: "#DC3545",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "4px"
  } as React.CSSProperties,
  success: {
    color: "#155724",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#d4edda",
    borderRadius: "4px"
  } as React.CSSProperties,
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1E90FF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px"
  } as React.CSSProperties
};
