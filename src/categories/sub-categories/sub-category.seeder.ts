import { Category } from "src/categories/category.entity";
import { CategoryType } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { DataSource } from "typeorm";
import { SubCategory } from "./sub-category.entity";

export async function seedSubCategories(dataSource: DataSource): Promise<void> {
  const subCategoryRepository = dataSource.getRepository(SubCategory);
  const categoryRepository = dataSource.getRepository(Category);
  const userRepository = dataSource.getRepository(User);

  // Get existing users
  const users = await userRepository.find({ take: 5 });
  if (users.length === 0) {
    console.log("⚠️  No users found. Please create users first before seeding sub-categories.");
    return;
  }

  // Get existing product categories
  const categories = await categoryRepository.find({
    where: { categoryType: CategoryType.PRODUCT },
  });
  if (categories.length === 0) {
    console.log(
      "⚠️  No product categories found. Please create categories first before seeding sub-categories.",
    );
    return;
  }

  // Helper function to generate random image URL from picsum
  const getRandomImage = (width = 600, height = 400, seed?: number): string => {
    const imageId = seed || Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/seed/${imageId}/${width}/${height}`;
  };

  // Check if sub-categories already exist
  const existingSubCategories = await subCategoryRepository.count();
  if (existingSubCategories > 0) {
    console.log(`ℹ️  ${existingSubCategories} sub-categories already exist. Skipping seed.`);
    return;
  }

  // Map of category slugs to their sub-categories
  const subCategoriesMap: Record<string, Array<{ name: string; nameAr: string }>> = {
    "men-clothing": [
      { name: "T-Shirts", nameAr: "قمصان" },
      { name: "Shirts", nameAr: "قمصان" },
      { name: "Pants", nameAr: "بناطيل" },
      { name: "Jackets", nameAr: "جاكيتات" },
      { name: "Shorts", nameAr: "شورتات" },
    ],
    "women-clothing": [
      { name: "Dresses", nameAr: "فساتين" },
      { name: "Tops & Blouses", nameAr: "بلوزات وقمصان" },
      { name: "Skirts", nameAr: "تنانير" },
      { name: "Pants", nameAr: "بناطيل" },
      { name: "Jackets & Coats", nameAr: "جاكيتات ومعاطف" },
    ],
    shoes: [
      { name: "Sneakers", nameAr: "أحذية رياضية" },
      { name: "Dress Shoes", nameAr: "أحذية رسمية" },
      { name: "Boots", nameAr: "أحذية" },
      { name: "Sandals", nameAr: "صنادل" },
      { name: "Heels", nameAr: "كعب عالي" },
    ],
    accessories: [
      { name: "Bags", nameAr: "حقائب" },
      { name: "Watches", nameAr: "ساعات" },
      { name: "Jewelry", nameAr: "مجوهرات" },
      { name: "Sunglasses", nameAr: "نظارات شمسية" },
      { name: "Belts", nameAr: "أحزمة" },
    ],
    electronics: [
      { name: "Smartphones", nameAr: "هواتف ذكية" },
      { name: "Laptops", nameAr: "أجهزة كمبيوتر محمولة" },
      { name: "Tablets", nameAr: "أجهزة لوحية" },
      { name: "Headphones", nameAr: "سماعات" },
      { name: "Smart Watches", nameAr: "ساعات ذكية" },
    ],
    "home-decor": [
      { name: "Furniture", nameAr: "أثاث" },
      { name: "Lighting", nameAr: "إضاءة" },
      { name: "Decorative Items", nameAr: "عناصر زخرفية" },
      { name: "Rugs & Carpets", nameAr: "سجاد وموكيت" },
      { name: "Curtains", nameAr: "ستائر" },
    ],
    "sports-outdoor": [
      { name: "Fitness Equipment", nameAr: "معدات لياقة" },
      { name: "Outdoor Gear", nameAr: "معدات خارجية" },
      { name: "Sports Apparel", nameAr: "ملابس رياضية" },
      { name: "Water Sports", nameAr: "رياضات مائية" },
      { name: "Camping Gear", nameAr: "معدات تخييم" },
    ],
    "beauty-personal-care": [
      { name: "Skincare", nameAr: "العناية بالبشرة" },
      { name: "Hair Care", nameAr: "العناية بالشعر" },
      { name: "Makeup", nameAr: "مكياج" },
      { name: "Fragrances", nameAr: "عطور" },
      { name: "Personal Care", nameAr: "العناية الشخصية" },
    ],
    "kids-baby": [
      { name: "Baby Clothing", nameAr: "ملابس أطفال" },
      { name: "Kids Clothing", nameAr: "ملابس أطفال" },
      { name: "Baby Gear", nameAr: "معدات أطفال" },
      { name: "Toys", nameAr: "ألعاب" },
      { name: "Baby Care", nameAr: "العناية بالأطفال" },
    ],
    "books-media": [
      { name: "Books", nameAr: "كتب" },
      { name: "Magazines", nameAr: "مجلات" },
      { name: "E-books", nameAr: "كتب إلكترونية" },
      { name: "Audiobooks", nameAr: "كتب صوتية" },
      { name: "Educational Materials", nameAr: "مواد تعليمية" },
    ],
    "toys-games": [
      { name: "Board Games", nameAr: "ألعاب الطاولة" },
      { name: "Puzzles", nameAr: "ألغاز" },
      { name: "Action Figures", nameAr: "شخصيات الحركة" },
      { name: "Building Toys", nameAr: "ألعاب بناء" },
      { name: "Educational Toys", nameAr: "ألعاب تعليمية" },
    ],
    jewelry: [
      { name: "Rings", nameAr: "خواتم" },
      { name: "Necklaces", nameAr: "قلائد" },
      { name: "Bracelets", nameAr: "أساور" },
      { name: "Earrings", nameAr: "أقراط" },
      { name: "Brooches", nameAr: "دبابيس" },
    ],
    watches: [
      { name: "Luxury Watches", nameAr: "ساعات فاخرة" },
      { name: "Smartwatches", nameAr: "ساعات ذكية" },
      { name: "Sports Watches", nameAr: "ساعات رياضية" },
      { name: "Casual Watches", nameAr: "ساعات كاجوال" },
      { name: "Vintage Watches", nameAr: "ساعات قديمة" },
    ],
    "bags-luggage": [
      { name: "Handbags", nameAr: "حقائب يد" },
      { name: "Backpacks", nameAr: "حقائب ظهر" },
      { name: "Travel Bags", nameAr: "حقائب سفر" },
      { name: "Wallets", nameAr: "محافظ" },
      { name: "Luggage", nameAr: "أمتعة" },
    ],
    furniture: [
      { name: "Living Room", nameAr: "غرفة المعيشة" },
      { name: "Bedroom", nameAr: "غرفة النوم" },
      { name: "Dining Room", nameAr: "غرفة الطعام" },
      { name: "Office", nameAr: "مكتب" },
      { name: "Outdoor", nameAr: "خارجي" },
    ],
    "kitchen-dining": [
      { name: "Cookware", nameAr: "أواني الطبخ" },
      { name: "Dinnerware", nameAr: "أواني الطعام" },
      { name: "Kitchen Appliances", nameAr: "أجهزة المطبخ" },
      { name: "Storage", nameAr: "تخزين" },
      { name: "Kitchen Tools", nameAr: "أدوات المطبخ" },
    ],
    "health-wellness": [
      { name: "Vitamins", nameAr: "فيتامينات" },
      { name: "Supplements", nameAr: "مكملات" },
      { name: "Fitness Equipment", nameAr: "معدات لياقة" },
      { name: "Wellness Products", nameAr: "منتجات العافية" },
      { name: "Medical Supplies", nameAr: "مستلزمات طبية" },
    ],
    automotive: [
      { name: "Car Care", nameAr: "العناية بالسيارة" },
      { name: "Car Accessories", nameAr: "إكسسوارات سيارات" },
      { name: "Car Parts", nameAr: "قطع سيارات" },
      { name: "Car Electronics", nameAr: "إلكترونيات سيارات" },
      { name: "Tires & Wheels", nameAr: "إطارات وعجلات" },
    ],
    "pet-supplies": [
      { name: "Dog Supplies", nameAr: "مستلزمات الكلاب" },
      { name: "Cat Supplies", nameAr: "مستلزمات القطط" },
      { name: "Pet Food", nameAr: "طعام الحيوانات الأليفة" },
      { name: "Pet Toys", nameAr: "ألعاب الحيوانات الأليفة" },
      { name: "Pet Care", nameAr: "العناية بالحيوانات الأليفة" },
    ],
  };

  // Create sub-categories for each category
  const subCategories: SubCategory[] = [];
  const user = users[0];
  let imageSeed = 1; // Counter for unique image seeds

  for (const category of categories) {
    const subCategoriesData = subCategoriesMap[category.slug || ""];
    if (!subCategoriesData) {
      continue; // Skip if no sub-categories defined for this category
    }

    // Create 2-5 sub-categories per category
    const numberOfSubCategories = Math.min(
      Math.floor(Math.random() * 4) + 2,
      subCategoriesData.length,
    ); // 2-5 sub-categories
    const selectedSubCategories = subCategoriesData
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfSubCategories);

    for (const subCategoryData of selectedSubCategories) {
      const slug = `${category.slug}-${subCategoryData.name.toLowerCase().replace(/\s+/g, "-")}`;

      const subCategory = subCategoryRepository.create({
        slug: slug,
        categoryType: CategoryType.PRODUCT,
        image: getRandomImage(600, 400, imageSeed++),
        content: [
          {
            name: subCategoryData.name,
            description: `${subCategoryData.name} - A sub-category of ${category.content.find(c => c.language_id === 1)?.name || category.slug}`,
            language_id: 1,
          },
          {
            name: subCategoryData.nameAr,
            description: `${subCategoryData.nameAr} - فئة فرعية من ${category.content.find(c => c.language_id === 2)?.name || category.slug}`,
            language_id: 2,
          },
        ],
        category: category,
        createdBy: user,
      });

      subCategories.push(subCategory);
    }
  }

  // Save all sub-categories in batches
  const batchSize = 30;
  for (let i = 0; i < subCategories.length; i += batchSize) {
    const batch = subCategories.slice(i, i + batchSize);
    await subCategoryRepository.save(batch);
    console.log(`✅ Saved batch ${Math.floor(i / batchSize) + 1} (${batch.length} sub-categories)`);
  }

  console.log(
    `✅ Successfully seeded ${subCategories.length} sub-categories for ${categories.length} categories.`,
  );
}

// Standalone execution
if (require.main === module) {
  import("../../../typeorm-cli").then(async ({ connectionSource }) => {
    try {
      await connectionSource.initialize();
      console.log("📦 Starting sub-category seeder...");
      await seedSubCategories(connectionSource);
      await connectionSource.destroy();
      console.log("✅ Sub-category seeder completed!");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error seeding sub-categories:", error);
      process.exit(1);
    }
  });
}
