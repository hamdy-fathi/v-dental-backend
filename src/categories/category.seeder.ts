import { CategoryType } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { DataSource } from "typeorm";
import { Category } from "./category.entity";

export async function seedCategories(dataSource: DataSource): Promise<void> {
  const categoryRepository = dataSource.getRepository(Category);
  const userRepository = dataSource.getRepository(User);

  // Get existing users
  const users = await userRepository.find({ take: 5 });
  if (users.length === 0) {
    console.log("⚠️  No users found. Please create users first before seeding categories.");
    return;
  }

  // Helper function to generate random image URL from picsum
  const getRandomImage = (width = 600, height = 400, seed?: number): string => {
    const imageId = seed || Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/seed/${imageId}/${width}/${height}`;
  };

  // Sample category data - Blog categories for V Dental Clinic
  const blogCategoriesData = [
    {
      slug: "dental-care",
      image: getRandomImage(600, 400, 1),
      categoryType: CategoryType.BLOG,
      content: [
        {
          name: "Dental Care",
          description:
            "Expert advice on dental health, oral hygiene, and daily dental care tips from our professional team.",
          language_id: 1,
        },
        {
          name: "العناية بالأسنان",
          description:
            "نصائح الخبراء حول صحة الأسنان ونظافة الفم ونصائح العناية اليومية من فريقنا المحترف.",
          language_id: 2,
        },
      ],
    },
    {
      slug: "dental-procedures",
      image: getRandomImage(600, 400, 2),
      categoryType: CategoryType.BLOG,
      content: [
        {
          name: "Dental Procedures",
          description:
            "Learn about various dental procedures, treatments, and what to expect during your visit.",
          language_id: 1,
        },
        {
          name: "الإجراءات السنية",
          description: "تعرف على مختلف الإجراءات والعلاجات السنية وما يمكن توقعه خلال زيارتك.",
          language_id: 2,
        },
      ],
    },
    {
      slug: "oral-health",
      image: getRandomImage(600, 400, 3),
      categoryType: CategoryType.BLOG,
      content: [
        {
          name: "Oral Health",
          description:
            "Essential information about maintaining optimal oral health and preventing dental problems.",
          language_id: 1,
        },
        {
          name: "صحة الفم",
          description: "معلومات أساسية حول الحفاظ على صحة الفم المثلى والوقاية من مشاكل الأسنان.",
          language_id: 2,
        },
      ],
    },
    {
      slug: "cosmetic-dentistry",
      image: getRandomImage(600, 400, 4),
      categoryType: CategoryType.BLOG,
      content: [
        {
          name: "Cosmetic Dentistry",
          description:
            "Transform your smile with our cosmetic dentistry services including whitening, veneers, and more.",
          language_id: 1,
        },
        {
          name: "طب الأسنان التجميلي",
          description:
            "حوّل ابتسامتك مع خدمات طب الأسنان التجميلي لدينا بما في ذلك التبييض والقشور والمزيد.",
          language_id: 2,
        },
      ],
    },
    {
      slug: "orthodontics",
      image: getRandomImage(600, 400, 5),
      categoryType: CategoryType.BLOG,
      content: [
        {
          name: "Orthodontics",
          description:
            "Information about orthodontic treatments, braces, aligners, and achieving a perfectly aligned smile.",
          language_id: 1,
        },
        {
          name: "تقويم الأسنان",
          description:
            "معلومات حول علاجات تقويم الأسنان، التقويم الثابت، التقويم الشفاف، والحصول على ابتسامة محاذاة مثالية.",
          language_id: 2,
        },
      ],
    },
    {
      slug: "dental-implants",
      image: getRandomImage(600, 400, 6),
      categoryType: CategoryType.BLOG,
      content: [
        {
          name: "Dental Implants",
          description:
            "Comprehensive guide to dental implants, their benefits, procedure, and recovery process.",
          language_id: 1,
        },
        {
          name: "زراعة الأسنان",
          description: "دليل شامل لزراعة الأسنان، فوائدها، الإجراء، وعملية التعافي.",
          language_id: 2,
        },
      ],
    },
    {
      slug: "preventive-care",
      image: getRandomImage(600, 400, 7),
      categoryType: CategoryType.BLOG,
      content: [
        {
          name: "Preventive Care",
          description:
            "Tips and strategies for preventing dental issues through regular checkups and proper oral hygiene.",
          language_id: 1,
        },
        {
          name: "الرعاية الوقائية",
          description:
            "نصائح واستراتيجيات لمنع مشاكل الأسنان من خلال الفحوصات المنتظمة ونظافة الفم السليمة.",
          language_id: 2,
        },
      ],
    },
    {
      slug: "pediatric-dentistry",
      image: getRandomImage(600, 400, 8),
      categoryType: CategoryType.BLOG,
      content: [
        {
          name: "Pediatric Dentistry",
          description:
            "Specialized dental care for children, including tips for parents on maintaining their child's oral health.",
          language_id: 1,
        },
        {
          name: "طب أسنان الأطفال",
          description:
            "رعاية سنية متخصصة للأطفال، بما في ذلك نصائح للآباء حول الحفاظ على صحة فم أطفالهم.",
          language_id: 2,
        },
      ],
    },
  ];

  // Get existing blog categories by slug
  const existingBlogCategories = await categoryRepository.find({
    where: { categoryType: CategoryType.BLOG },
  });
  const existingSlugs = new Set(existingBlogCategories.map(cat => cat.slug));

  // Get slugs of categories we want to create
  const targetSlugs = new Set(blogCategoriesData.map(cat => cat.slug));

  // Find categories to delete (exist but not in our target list)
  const categoriesToDelete = existingBlogCategories.filter(cat => !targetSlugs.has(cat.slug));

  // Delete old categories that are not in our target list
  if (categoriesToDelete.length > 0) {
    await categoryRepository.remove(categoriesToDelete);
    console.log(`🗑️  Deleted ${categoriesToDelete.length} old blog categories.`);
  }

  // Filter out categories that already exist
  const categoriesToCreate = blogCategoriesData.filter(
    categoryData => !existingSlugs.has(categoryData.slug),
  );

  if (categoriesToCreate.length === 0) {
    console.log(`ℹ️  All ${blogCategoriesData.length} blog categories already exist.`);
    if (categoriesToDelete.length > 0) {
      console.log(`✅ Cleaned up ${categoriesToDelete.length} old categories.`);
    }
    return;
  }

  console.log(
    `ℹ️  ${existingBlogCategories.length - categoriesToDelete.length} blog categories already exist. Creating ${categoriesToCreate.length} new categories...`,
  );

  // Create new blog categories
  const categories: Category[] = [];

  for (let i = 0; i < categoriesToCreate.length; i++) {
    const categoryData = categoriesToCreate[i];
    const user = users[i % users.length];

    const category = categoryRepository.create({
      ...categoryData,
      createdBy: user,
    });

    categories.push(category);
  }

  // Save all new categories
  await categoryRepository.save(categories);
  console.log(`✅ Successfully seeded ${categories.length} new blog categories.`);
}

// Standalone execution
if (require.main === module) {
  import("../../typeorm-cli").then(async ({ connectionSource }) => {
    try {
      await connectionSource.initialize();
      console.log("📦 Starting category seeder...");
      await seedCategories(connectionSource);
      await connectionSource.destroy();
      console.log("✅ Category seeder completed!");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error seeding categories:", error);
      process.exit(1);
    }
  });
}
