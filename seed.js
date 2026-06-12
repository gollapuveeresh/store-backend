require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/stylehub";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Seed Admin
    await User.create({
      name: "StyleHub Admin",
      email: "admin@stylehub.com",
      password: "admin123",
      role: "admin",
      tier: "VIP Platinum Elite",
    });

    // Seed Sample Customer
    await User.create({
      name: "Alexander Mercer",
      email: "alex@luxury.com",
      password: "customer123",
      role: "customer",
      phone: "+91 98765 43210",
      address: "12, Jubilee Hills, Hyderabad, Telangana - 500033",
      tier: "VIP Platinum Elite",
      discount: 10,
    });

    console.log("👤 Users seeded");

    // Seed Products
    const products = [
      {
        name: "Midnight Velvet Blazer",
        description: "A hand-tailored midnight velvet blazer crafted from premium European fabric. Perfect for evening events.",
        price: 28500,
        category: "mens",
        images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b5f0e?w=600&auto=format&fit=crop&q=80"],
        sizes: ["S", "M", "L", "XL"],
        stock: 15,
        discount: 0,
        featured: true,
        tags: ["blazer", "formal", "velvet"],
      },
      {
        name: "Cashmere Overcoat",
        description: "Luxurious full-length cashmere overcoat with silk lining. A wardrobe essential.",
        price: 45000,
        category: "mens",
        images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop&q=80"],
        sizes: ["M", "L", "XL", "XXL"],
        stock: 8,
        discount: 10,
        featured: true,
        tags: ["coat", "cashmere", "winter"],
      },
      {
        name: "Silk Evening Gown",
        description: "Flowing pure silk evening gown with hand-embroidered detailing. An exclusive atelier creation.",
        price: 55000,
        category: "womens",
        images: ["https://images.unsplash.com/photo-1566479179817-c0a3d8c88d45?w=600&auto=format&fit=crop&q=80"],
        sizes: ["XS", "S", "M", "L"],
        stock: 6,
        discount: 0,
        featured: true,
        tags: ["gown", "silk", "evening", "luxury"],
      },
      {
        name: "Tailored Virgin Wool Coat",
        description: "Classic double-breasted coat in virgin wool with mother-of-pearl buttons.",
        price: 38000,
        category: "womens",
        images: ["https://images.unsplash.com/photo-1548624313-0396bfc7f71d?w=600&auto=format&fit=crop&q=80"],
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 12,
        discount: 15,
        featured: false,
        tags: ["coat", "wool", "winter", "classic"],
      },
      {
        name: "Merino Polo Shirt",
        description: "Ultra-fine merino wool polo with ribbed collar. Available in 5 curated colors.",
        price: 8500,
        category: "mens",
        images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&auto=format&fit=crop&q=80"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 30,
        discount: 0,
        featured: false,
        tags: ["polo", "merino", "casual"],
      },
      {
        name: "Haute Couture Mini Dress",
        description: "Structured A-line mini dress with architectural shoulders and invisible zip.",
        price: 22000,
        category: "womens",
        images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&auto=format&fit=crop&q=80"],
        sizes: ["XS", "S", "M"],
        stock: 10,
        discount: 5,
        featured: true,
        tags: ["dress", "mini", "couture"],
      },
      {
        name: "Premium Leather Belt",
        description: "Hand-stitched full-grain leather belt with brushed gold buckle.",
        price: 4500,
        category: "accessories",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"],
        sizes: ["S", "M", "L"],
        stock: 25,
        discount: 0,
        featured: false,
        tags: ["belt", "leather", "accessories"],
      },
      {
        name: "Silk Pocket Square",
        description: "100% pure silk pocket square with hand-rolled edges. 12 exclusive patterns.",
        price: 2800,
        category: "accessories",
        images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b5f0e?w=600&auto=format&fit=crop&q=80"],
        sizes: ["S"],
        stock: 50,
        discount: 0,
        featured: false,
        tags: ["pocket square", "silk", "accessories"],
      },
    ];

    await Product.insertMany(products);
    console.log("👗 Products seeded:", products.length, "items");

    console.log("\n🎉 Seed complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin Login:    admin@stylehub.com / admin123");
    console.log("Customer Login: alex@luxury.com   / customer123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seedData();
