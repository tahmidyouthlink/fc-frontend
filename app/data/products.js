export const products = [
  {
    title: "Classic White Shirt",
    price: 1200,
    discount: null,
    arrival: new Date("2024-07-10"),
    isNewArrival: false,
    inStock: 24,
    salesThisMonth: 6,
    imageURLs: [
      "/products/p-1.jpeg",
      "/products/p-11.jpeg",
      "/products/p-14.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L"],
    colors: ["Red", "Purple", "Green"],
    materials: ["Cotton"],
    restOfOutfit: [6, 12],
  },
  {
    title: "Denim Jeans",
    price: 2000,
    discount: null,
    arrival: new Date("2024-07-20"),
    isNewArrival: true,
    inStock: 8,
    salesThisMonth: 4,
    imageURLs: ["/products/p-2.jpeg", "/products/p-8.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Pants", subCategories: ["Casual"] },
    sizes: ["M", "L", "XL"],
    colors: ["Blue", "Orange"],
    materials: ["Denim"],
    restOfOutfit: [],
  },
  {
    title: "Leather Oxford Shoes",
    price: 3000,
    discount: null,
    arrival: new Date("2024-07-02"),
    isNewArrival: false,
    inStock: 38,
    salesThisMonth: 18,
    imageURLs: [
      "/products/p-3.jpeg",
      "/products/p-9.jpeg",
      "/products/p-7.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shoes", subCategories: ["Formal"] },
    sizes: ["M", "L", "XL"],
    colors: ["Brown", "Black", "Green"],
    materials: ["Leather"],
    restOfOutfit: [],
  },
  {
    title: "Graphic T-Shirt",
    price: 900,
    discount: null,
    arrival: new Date("2024-07-15"),
    isNewArrival: false,
    inStock: 3,
    salesThisMonth: 23,
    imageURLs: ["/products/p-4.webp"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multicolor"],
    materials: ["Cotton", "Polyester"],
    restOfOutfit: [17],
  },
  {
    title: "Chino Pants",
    price: 1800,
    discount: {
      amount: "৳ 300",
      finalPrice: 1500,
    },
    arrival: new Date("2024-07-21"),
    isNewArrival: true,
    inStock: 11,
    salesThisMonth: 5,
    imageURLs: [
      "/products/p-5.webp",
      "/products/p-15.jpeg",
      "/products/p-11.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: {
      mainCategory: "Pants",
      subCategories: ["Business", "Casual"],
    },
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Red", "Black"],
    materials: ["Cotton"],
    restOfOutfit: [],
  },
  {
    title: "Running Shoes",
    price: 2500,
    discount: null,
    arrival: new Date("2024-07-11"),
    isNewArrival: false,
    inStock: 0,
    salesThisMonth: 19,
    imageURLs: [
      "/products/p-6.jpeg",
      "/products/p-2.jpeg",
      "/products/p-9.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shoes", subCategories: ["Sports"] },
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["Red", "Brown", "White"],
    materials: ["Polyester", "Rubber"],
    restOfOutfit: [],
  },
  {
    title: "Striped Dress Shirt",
    price: 2200,
    discount: {
      amount: "10%",
      finalPrice: 1980,
    },
    arrival: new Date("2024-07-11"),
    isNewArrival: false,
    inStock: 30,
    salesThisMonth: 2,
    imageURLs: [
      "/products/p-7.jpeg",
      "/products/p-1.jpeg",
      "/products/p-14.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Formal"] },
    sizes: ["S", "M", "L"],
    colors: ["Blue", "Brown", "Orange"],
    materials: ["Cotton"],
    restOfOutfit: [0, 12],
  },
  {
    title: "Cargo Pants",
    price: 1500,
    discount: null,
    arrival: new Date("2024-07-04"),
    isNewArrival: false,
    inStock: 21,
    salesThisMonth: 4,
    imageURLs: ["/products/p-8.jpeg", "/products/p-1.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Pants", subCategories: ["Casual"] },
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["Green", "Red"],
    materials: ["Cotton", "Polyester"],
    restOfOutfit: [],
  },
  {
    title: "Chelsea Boots",
    price: 2800,
    discount: {
      amount: "25%",
      finalPrice: 2100,
    },
    arrival: new Date("2024-07-16"),
    isNewArrival: false,
    inStock: 12,
    salesThisMonth: 0,
    imageURLs: [
      "/products/p-9.jpeg",
      "/products/p-4.webp",
      "/products/p-1.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shoes", subCategories: ["Casual"] },
    sizes: ["M", "L", "XL"],
    colors: ["Brown", "Blue", "Yellow"],
    materials: ["Leather"],
    restOfOutfit: [],
  },
  {
    title: "Plaid Flannel Shirt",
    price: 1300,
    discount: null,
    arrival: new Date("2024-07-01"),
    isNewArrival: false,
    inStock: 10,
    salesThisMonth: 3,
    imageURLs: ["/products/p-10.webp"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red"],
    materials: ["Cotton"],
    restOfOutfit: [],
  },
  {
    title: "Slim Fit Dress Pants",
    price: 2500,
    discount: null,
    arrival: new Date("2024-07-18"),
    isNewArrival: true,
    inStock: 15,
    salesThisMonth: 13,
    imageURLs: ["/products/p-11.jpeg", "/products/p-6.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Pants", subCategories: ["Formal"] },
    sizes: ["M", "L", "XL"],
    colors: ["Black", "White"],
    materials: ["Polyester"],
    restOfOutfit: [],
  },
  {
    title: "Loafers",
    price: 2300,
    discount: null,
    arrival: new Date("2024-07-01"),
    isNewArrival: false,
    inStock: 5,
    salesThisMonth: 5,
    imageURLs: [
      "/products/p-12.webp",
      "/products/p-7.jpeg",
      "/products/p-3.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: {
      mainCategory: "Shoes",
      subCategories: ["Business", "Casual"],
    },
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["Brown", "Gray", "Blue"],
    materials: ["Leather"],
    restOfOutfit: [],
  },
  {
    title: "Henley Shirt",
    price: 1100,
    discount: {
      amount: "৳ 100",
      finalPrice: 1000,
    },
    arrival: new Date("2024-07-12"),
    isNewArrival: false,
    inStock: 0,
    salesThisMonth: 6,
    imageURLs: [
      "/products/p-6.jpeg",
      "/products/p-1.jpeg",
      "/products/p-2.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L"],
    colors: ["Green", "Yellow", "Gray"],
    materials: ["Cotton"],
    restOfOutfit: [0, 6],
  },
  {
    title: "Khaki Pants",
    price: 1600,
    discount: null,
    arrival: new Date("2024-07-06"),
    isNewArrival: false,
    inStock: 18,
    salesThisMonth: 2,
    imageURLs: [
      "/products/p-14.jpeg",
      "/products/p-6.jpeg",
      "/products/p-8.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: {
      mainCategory: "Pants",
      subCategories: ["Business", "Casual"],
    },
    sizes: ["M", "L", "XL"],
    colors: ["Blue", "Orange", "Gray"],
    materials: ["Cotton"],
    restOfOutfit: [],
  },
  {
    title: "Sneakers",
    price: 2100,
    discount: null,
    arrival: new Date("2024-07-06"),
    isNewArrival: false,
    inStock: 20,
    salesThisMonth: 0,
    imageURLs: [
      "/products/p-15.jpeg",
      "/products/p-9.jpeg",
      "/products/p-4.webp",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shoes", subCategories: ["Casual"] },
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["White", "Black", "Red"],
    materials: ["Polyester", "Rubber"],
    restOfOutfit: [],
  },
  {
    title: "Polka Dot Shirt",
    price: 1400,
    discount: null,
    arrival: new Date("2024-07-15"),
    isNewArrival: false,
    inStock: 27,
    salesThisMonth: 3,
    imageURLs: ["/products/p-1.jpeg", "/products/p-11.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L"],
    colors: ["Blue", "Green"],
    materials: ["Cotton"],
    restOfOutfit: [],
  },
  {
    title: "Corduroy Pants",
    price: 1900,
    discount: null,
    arrival: new Date("2024-07-15"),
    isNewArrival: false,
    inStock: 9,
    salesThisMonth: 11,
    imageURLs: ["/products/p-2.jpeg", "/products/p-6.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Pants", subCategories: ["Casual"] },
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["Brown", "Yellow"],
    materials: ["Corduroy"],
    restOfOutfit: [],
  },
  {
    title: "Derby Shoes",
    price: 2700,
    discount: null,
    arrival: new Date("2024-07-02"),
    isNewArrival: true,
    inStock: 5,
    salesThisMonth: 15,
    imageURLs: [
      "/products/p-3.jpeg",
      "/products/p-9.jpeg",
      "/products/p-7.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shoes", subCategories: ["Formal"] },
    sizes: ["M", "L", "XL"],
    colors: ["Black", "White", "Red"],
    materials: ["Leather"],
    restOfOutfit: [3],
  },
  {
    title: "Linen Shirt",
    price: 1700,
    discount: null,
    arrival: new Date("2024-07-02"),
    isNewArrival: false,
    inStock: 19,
    salesThisMonth: 12,
    imageURLs: [
      "/products/p-4.webp",
      "/products/p-10.webp",
      "/products/p-12.webp",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L"],
    colors: ["White", "Blue", "Green"],
    materials: ["Linen"],
    restOfOutfit: [],
  },
  {
    title: "SweatPants",
    price: 1200,
    discount: null,
    arrival: new Date("2024-07-09"),
    isNewArrival: false,
    inStock: 26,
    salesThisMonth: 9,
    imageURLs: ["/products/p-5.webp", "/products/p-15.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Pants", subCategories: ["Sports"] },
    sizes: ["M", "L", "XL"],
    colors: ["Gray", "Red"],
    materials: ["Cotton", "Polyester"],
    restOfOutfit: [],
  },
  {
    title: "Monk Strap Shoes",
    price: 2900,
    discount: null,
    arrival: new Date("2024-07-14"),
    isNewArrival: false,
    inStock: 3,
    salesThisMonth: 27,
    imageURLs: ["/products/p-6.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shoes", subCategories: ["Formal"] },
    sizes: ["M", "L", "XL"],
    colors: ["Black"],
    materials: ["Leather"],
    restOfOutfit: [],
  },
  {
    title: "Chambray Shirt",
    price: 1500,
    discount: {
      amount: "৳ 250",
      finalPrice: 1250,
    },
    arrival: new Date("2024-07-13"),
    isNewArrival: false,
    inStock: 5,
    salesThisMonth: 13,
    imageURLs: [
      "/products/p-7.jpeg",
      "/products/p-1.jpeg",
      "/products/p-14.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Green"],
    materials: ["Chambray"],
    restOfOutfit: [],
  },
  {
    title: "Wool Trousers",
    price: 2300,
    discount: null,
    arrival: new Date("2024-07-14"),
    isNewArrival: false,
    inStock: 0,
    salesThisMonth: 9,
    imageURLs: [
      "/products/p-8.jpeg",
      "/products/p-3.jpeg",
      "/products/p-1.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Pants", subCategories: ["Formal"] },
    sizes: ["M", "L", "XL"],
    colors: ["Gray", "Black", "Yellow"],
    materials: ["Wool"],
    restOfOutfit: [26],
  },
  {
    title: "Hiking Boots",
    price: 2600,
    discount: null,
    arrival: new Date("2024-07-17"),
    isNewArrival: false,
    inStock: 15,
    salesThisMonth: 5,
    imageURLs: [
      "/products/p-9.jpeg",
      "/products/p-4.webp",
      "/products/p-1.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shoes", subCategories: ["Sports"] },
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["Brown", "Red", "Gray"],
    materials: ["Leather", "Rubber"],
    restOfOutfit: [],
  },
  {
    title: "Polo Shirt",
    price: 1300,
    discount: null,
    arrival: new Date("2024-07-17"),
    isNewArrival: false,
    inStock: 11,
    salesThisMonth: 7,
    imageURLs: [
      "/products/p-10.webp",
      "/products/p-5.webp",
      "/products/p-2.jepg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L"],
    colors: ["Blue", "Green", "White"],
    materials: ["Cotton"],
    restOfOutfit: [],
  },
  {
    title: "Track Pants",
    price: 1400,
    discount: null,
    arrival: new Date("2024-07-22"),
    isNewArrival: true,
    inStock: 12,
    salesThisMonth: 20,
    imageURLs: ["/products/p-11.jpeg", "/products/p-6.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Pants", subCategories: ["Sports"] },
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["Black", "Blue"],
    materials: ["Polyester"],
    restOfOutfit: [],
  },
  {
    title: "Brogues",
    price: 2400,
    discount: {
      amount: "৳ 300",
      finalPrice: 2040,
    },
    arrival: new Date("2024-07-05"),
    isNewArrival: false,
    inStock: 29,
    salesThisMonth: 14,
    imageURLs: ["/products/p-12.webp"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: {
      mainCategory: "Shoes",
      subCategories: ["Business", "Casual"],
    },
    sizes: ["M", "L", "XL"],
    colors: ["Brown"],
    materials: ["Leather"],
    restOfOutfit: [22],
  },
  {
    title: "Hawaiian Shirt",
    price: 1000,
    discount: null,
    arrival: new Date("2024-07-04"),
    isNewArrival: false,
    inStock: 8,
    salesThisMonth: 0,
    imageURLs: ["/products/p-6.jpeg"],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shirts", subCategories: ["Casual"] },
    sizes: ["S", "M", "L"],
    colors: ["Multicolor"],
    materials: ["Cotton"],
    restOfOutfit: [],
  },
  {
    title: "Jogger Pants",
    price: 1600,
    discount: null,
    arrival: new Date("2024-07-24"),
    isNewArrival: true,
    inStock: 25,
    salesThisMonth: 0,
    imageURLs: [
      "/products/p-14.jpeg",
      "/products/p-6.jpeg",
      "/products/p-8.jpeg",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Pants", subCategories: ["Sports"] },
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Red", "Green"],
    materials: ["Polyester", "Cotton"],
    restOfOutfit: [],
  },
  {
    title: "Espadrilles",
    price: 1300,
    discount: null,
    arrival: new Date("2024-07-03"),
    isNewArrival: false,
    inStock: 18,
    salesThisMonth: 32,
    imageURLs: [
      "/products/p-15.jpeg",
      "/products/p-9.jpeg",
      "/products/p-4.webp",
    ],
    sizeGuide: "/single-product/size-guide.jpg",
    categories: { mainCategory: "Shoes", subCategories: ["Casual"] },
    sizes: ["S", "M", "L"],
    colors: ["Blue", "Gray", "Brown"],
    materials: ["Canvas", "Jute"],
    restOfOutfit: [],
  },
];
