import React from "react";

const Practise = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Create order from backend
    const orderData = await fetch(
      "http://localhost:5000/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 500 }), // Amount in INR
      }
    ).then((res) => res.json());

    const options = {
      key: "your_razorpay_key_id", // Replace with your Razorpay Key ID
      amount: orderData.amount,
      currency: orderData.currency,
      name: "My App",
      description: "Test Payment",
      order_id: orderData.id,
      handler: async function (response) {
        // Call backend to verify payment
        const verifyRes = await fetch(
          "http://localhost:5000/api/payment/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          }
        );

        const data = await verifyRes.json();
        if (data.success) {
          alert("Payment Successful and Verified!");
        } else {
          alert("Payment Failed Verification.");
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test Razorpay Gateway</h2>
      <button
        onClick={handlePayment}
        style={{ padding: "10px 20px", fontSize: "16px" }}
        className="border border-black px-4 py-2"
      >
        Pay ₹500
      </button>
    </div>
  );
};

export default Practise;
