export const BRANDS = [
    {
        id: "b1",
        name: "Zara",
        storeLocation: "Phoenix Marketcity, Viman Nagar, Pune",
        deliveryRadiusKm: 15,
        categories: ["Men", "Women", "Footwear", "Accessories"],
        avgPrepTimeMinutes: 20,
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg"
    },
    {
        id: "b2",
        name: "H&M",
        storeLocation: "Phoenix Marketcity, Viman Nagar, Pune",
        deliveryRadiusKm: 15,
        categories: ["Men", "Women", "Kids"],
        avgPrepTimeMinutes: 15,
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg"
    },
    {
        id: "b3",
        name: "Nike",
        storeLocation: "Westend Mall, Aundh, Pune",
        deliveryRadiusKm: 12,
        categories: ["Footwear", "Sportswear", "Accessories"],
        avgPrepTimeMinutes: 10,
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
    },
    {
        id: "b4",
        name: "Levi's",
        storeLocation: "Pavilion Mall, SB Road, Pune",
        deliveryRadiusKm: 10,
        categories: ["Men", "Women", "Jeans"],
        avgPrepTimeMinutes: 15,
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Levis-logo-quer.svg"
    },
    {
        id: "b5",
        name: "Adidas",
        storeLocation: "Phoenix Marketcity, Viman Nagar, Pune",
        deliveryRadiusKm: 15,
        categories: ["Footwear", "Sportswear"],
        avgPrepTimeMinutes: 15,
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
    }
];

export const PRODUCTS = [
    {
        id: "p1",
        brandId: "b1",
        name: "Oversized Cotton T-Shirt",
        category: "Men",
        price: 1590,
        originalPrice: 1590,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
        sizeOptions: ["S", "M", "L", "XL"],
        inStock: true,
        tags: ["Best Seller"],
        estimatedDeliveryMinutes: 60
    },
    {
        id: "p2",
        brandId: "b1",
        name: "Floral Print Dress",
        category: "Women",
        price: 2990,
        originalPrice: 3590,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800",
        sizeOptions: ["XS", "S", "M", "L"],
        inStock: true,
        tags: ["New Arrival"],
        estimatedDeliveryMinutes: 60
    },
    {
        id: "p3",
        brandId: "b2",
        name: "Slim Fit Jeans",
        category: "Men",
        price: 1999,
        originalPrice: 2499,
        image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=800",
        sizeOptions: ["30", "32", "34", "36"],
        inStock: true,
        tags: [],
        estimatedDeliveryMinutes: 45
    },
    {
        id: "p4",
        brandId: "b3",
        name: "Air Zoom Pegasus",
        category: "Footwear",
        price: 9995,
        originalPrice: 9995,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
        sizeOptions: ["UK 7", "UK 8", "UK 9", "UK 10"],
        inStock: true,
        tags: ["Trending"],
        estimatedDeliveryMinutes: 60
    },
    {
        id: "p5",
        brandId: "b4",
        name: "Trucker Jacket",
        category: "Men",
        price: 4599,
        originalPrice: 5999,
        image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?auto=format&fit=crop&q=80&w=800",
        sizeOptions: ["S", "M", "L", "XL"],
        inStock: true,
        tags: ["Classic"],
        estimatedDeliveryMinutes: 50
    },
    {
        id: "p6",
        brandId: "b5",
        name: "Ultraboost Light",
        category: "Footwear",
        price: 13999,
        originalPrice: 13999,
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=800",
        sizeOptions: ["UK 7", "UK 8", "UK 9", "UK 10"],
        inStock: true,
        tags: ["Premium"],
        estimatedDeliveryMinutes: 60
    },
    {
        id: "p7",
        brandId: "b2",
        name: "Linen Blend Shirt",
        category: "Women",
        price: 1499,
        originalPrice: 1499,
        image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80&w=800",
        sizeOptions: ["XS", "S", "M", "L"],
        inStock: true,
        tags: ["Summer"],
        estimatedDeliveryMinutes: 45
    },
    {
        id: "p8",
        brandId: "b1",
        name: "Leather Crossbody Bag",
        category: "Accessories",
        price: 3990,
        originalPrice: 3990,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
        sizeOptions: ["One Size"],
        inStock: true,
        tags: [],
        estimatedDeliveryMinutes: 60
    }
];

export const LOCALITIES = [
    { name: "Viman Nagar", pincode: "411014", serviceable: true },
    { name: "Koregaon Park", pincode: "411001", serviceable: true },
    { name: "Kalyani Nagar", pincode: "411006", serviceable: true },
    { name: "Kharadi", pincode: "411014", serviceable: true },
    { name: "Magarpatta", pincode: "411028", serviceable: true },
    { name: "Aundh", pincode: "411007", serviceable: true },
    { name: "Baner", pincode: "411045", serviceable: true },
    { name: "Kothrud", pincode: "411038", serviceable: false }, // Too far for 60 min from Viman Nagar/Aundh usually
    { name: "Hinjewadi", pincode: "411057", serviceable: false }
];
