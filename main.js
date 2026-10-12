const cart = {
  items: [
    {
      id: 1,
      name: "Laptop",
      price: 15000000,
      quantity: 1,
      category: "Electronics",
    },
    {
      id: 2,
      name: "Mouse",
      price: 300000,
      quantity: 2,
      category: "Electronics",
    },
  ],
  _discountRate: 0,//tỉ lệ giảm giá, mặc định là 0 ( _ tượng trưng cho dữ liệu private, không nên truy cập trực tiếp từ bên ngoài)
  validCoupons: { // danh sách mã giảm giá hợp lệ
    WELCOME10: 0.1, // 10% giảm giá
    SUMMER20: 0.2, // 20% giảm giá
    VIP30: 0.3,// 30% giảm giá
  },
  // 1. Trả về tổng số lượng sản phẩm trong giỏ
  get totalQuantity() {
    let total = 0;
    this.items.forEach(function (item) {
      total += item.quantity;
    });
    return total;
  },
  // 2. Tính tổng tiền hàng
  get subtotal() {
    let total = 0;

    this.items.forEach(function (item) {
      total += item.price * item.quantity;
    });
    return total;
  },

  // 3. Áp dụng mã giảm giá
  set applyCoupon(code) {
    if (this.validCoupons[code] !== undefined) {
      this._discountRate = this.validCoupons[code];

      console.log(
        `Áp dụng mã ${code} thành công: giảm ${
          this._discountRate * 100
        }%`
      );
    } else {
      console.log("Mã giảm giá không hợp lệ!");
    }
  },

  // 4. Tính tổng tiền sau giảm giá
  get totalPrice() {
    return this.subtotal - this.subtotal * this._discountRate;
  },

  // 5. Thêm nhiều sản phẩm
  addItems(...newItems) {
    newItems.forEach(function (newItem) {
      const existingItem = this.items.find(function (item) {
        return item.id === newItem.id;
      });
      // Nếu sản phẩm đã tồn tại
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      }
      // Nếu sản phẩm chưa tồn tại
      else {
        if (newItem.quantity === undefined) {
          newItem.quantity = 1;
        }

        this.items.push(newItem);
      }
    }, this);
  },
  // 6. Cập nhật số lượng
  updateQuantity(id, newQuantity) {
    const item = this.items.find(function (item) {
      return item.id === id;
    });

    // Không tìm thấy sản phẩm
    if (!item) {
      console.log("Không tìm thấy sản phẩm có id:", id);
      return;
    }

    // Nếu số lượng <= 0 thì xoá
    if (newQuantity <= 0) {
      this.removeItem(id);
      return;
    }

    // Cập nhật số lượng
    item.quantity = newQuantity;
  },

  // 7. Xoá sản phẩm
  removeItem(id) {
    const oldLength = this.items.length;

    this.items = this.items.filter(function (item) {
      return item.id !== id;
    });

    if (this.items.length === oldLength) {
      console.log("Không tìm thấy sản phẩm có id:", id);
    }
  },
  // 8. Lọc sản phẩm theo category
  getItemsByCategory(category) {
    return this.items.filter(function (item) {
      return item.category === category;
    });
  },

  // 9. In hoá đơn
  printInvoice() {
    console.log("================ HOÁ ĐƠN BAN HÀNG ================");
    this.items.forEach(function (item) {
      const itemTotal = item.price * item.quantity;
      console.log(
        `${item.name} - ${item.price} x ${item.quantity} = ${itemTotal}`
      );
    });
    const discountAmount = this.subtotal * this._discountRate;
    console.log(`Tổng tiền hàng: ${this.subtotal}`);
    console.log(
      `Giảm giá: ${this._discountRate * 100}% (-${discountAmount})`
    );
    console.log(`Tổng thanh toán: ${this.totalPrice}`);
    console.log("==================================================");
  },
};
console.log("===== THÔNG TIN GIỎ HÀNG BAN ĐẦU =====");
console.log("Số lượng sản phẩm:", cart.totalQuantity);
console.log("Tạm tính:", cart.subtotal);
cart.addItems({
  id: 3,
  name: "Keyboard",
  price: 800000,
  quantity: 1,
  category: "Electronics",
});
console.log("Giỏ hàng sau khi thêm sản phẩm:", cart.items);
cart.updateQuantity(2, 3);
console.log("Giỏ hàng sau khi cập nhật số lượng:", cart.items);
console.log("Tổng số lượng mới:", cart.totalQuantity);
console.log(
  "Sản phẩm thuộc danh mục Electronics:",
  cart.getItemsByCategory("Electronics")
);
cart.applyCoupon = "WELCOME10";
console.log("Tổng tiền sau giảm giá:", cart.totalPrice);
cart.printInvoice();
cart.removeItem(3);
console.log("Giỏ hàng sau khi xoá sản phẩm:", cart.items);