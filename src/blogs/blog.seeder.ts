import { Category } from "src/categories/category.entity";
import { CategoryType } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { DataSource } from "typeorm";
import { Blog } from "./blog.entity";

export async function seedBlogs(dataSource: DataSource): Promise<void> {
  const blogRepository = dataSource.getRepository(Blog);
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);

  // Get existing users
  const users = await userRepository.find({ take: 5 });
  if (users.length === 0) {
    console.log("⚠️  No users found. Please create users first before seeding blogs.");
    return;
  }

  // Get or create blog categories
  let blogCategories = await categoryRepository.find({
    where: { categoryType: CategoryType.BLOG },
    take: 5,
  });

  // If no blog categories exist, create some
  if (blogCategories.length === 0) {
    const newCategories = [
      {
        slug: "technology",
        categoryType: CategoryType.BLOG,
        content: [
          {
            name: "Technology",
            description: "Latest technology news and updates",
            language_id: 1,
          },
          {
            name: "التكنولوجيا",
            description: "أحدث أخبار وتحديثات التكنولوجيا",
            language_id: 2,
          },
        ],
      },
      {
        slug: "fashion",
        categoryType: CategoryType.BLOG,
        content: [
          {
            name: "Fashion",
            description: "Fashion trends and style tips",
            language_id: 1,
          },
          {
            name: "الموضة",
            description: "اتجاهات الموضة ونصائح الأناقة",
            language_id: 2,
          },
        ],
      },
      {
        slug: "lifestyle",
        categoryType: CategoryType.BLOG,
        content: [
          {
            name: "Lifestyle",
            description: "Lifestyle tips and inspiration",
            language_id: 1,
          },
          {
            name: "نمط الحياة",
            description: "نصائح وإلهام لنمط الحياة",
            language_id: 2,
          },
        ],
      },
    ];

    const createdCategories = categoryRepository.create(
      newCategories.map((cat, index) => ({
        ...cat,
        createdBy: users[index % users.length],
      })),
    );
    blogCategories = await categoryRepository.save(createdCategories);
    console.log(`✅ Created ${blogCategories.length} blog categories.`);
  }

  // Helper function to generate random image URL from picsum
  const getRandomImage = (width = 600, height = 400, seed?: number): string => {
    const imageId = seed || Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/seed/${imageId}/${width}/${height}`;
  };

  // Helper function to generate multiple random images
  const getRandomImages = (count: number, width = 600, height = 400): string[] => {
    return Array.from({ length: count }, (_, i) => getRandomImage(width, height, i + 1));
  };

  // Sample blog data
  const blogsData = [
    {
      order: 1,
      slug: "latest-fashion-trends-2024",
      postType: "article",
      isFeatured: true,
      isPublished: true,
      views: 1250,
      startDate: new Date().toISOString(),
      endDate: null,
      content: [
        {
          title: "Latest Fashion Trends for 2024",
          subTitle: "Discover the Hottest Styles This Year",
          description:
            "Explore the most exciting fashion trends that are taking the world by storm in 2024. From sustainable fashion to bold colors, we cover everything you need to know.",
          shortDescription:
            "Discover the hottest fashion trends of 2024 and stay ahead of the style curve.",
          metaTitle: "Latest Fashion Trends 2024 | Style Guide",
          metaDescription:
            "Complete guide to the latest fashion trends in 2024. Stay stylish with our expert tips.",
          language_id: 1,
        },
        {
          title: "أحدث اتجاهات الموضة لعام 2024",
          subTitle: "اكتشف أنماط الموضة الأكثر رواجاً هذا العام",
          description:
            "استكشف أحدث اتجاهات الموضة التي تجتاح العالم في عام 2024. من الموضة المستدامة إلى الألوان الجريئة، نغطي كل ما تحتاج معرفته.",
          shortDescription: "اكتشف أحدث اتجاهات الموضة لعام 2024 وابق في المقدمة.",
          metaTitle: "أحدث اتجاهات الموضة 2024 | دليل الأناقة",
          metaDescription: "دليل شامل لأحدث اتجاهات الموضة في 2024. ابق أنيقاً مع نصائحنا الخبيرة.",
          language_id: 2,
        },
      ],
    },
    {
      order: 2,
      slug: "sustainable-fashion-guide",
      postType: "article",
      isFeatured: false,
      isPublished: true,
      views: 890,
      startDate: new Date().toISOString(),
      endDate: null,
      content: [
        {
          title: "Complete Guide to Sustainable Fashion",
          subTitle: "How to Build an Eco-Friendly Wardrobe",
          description:
            "Learn how to make sustainable fashion choices that benefit both you and the environment. Discover brands, materials, and practices that promote ethical fashion.",
          shortDescription:
            "Learn how to build an eco-friendly wardrobe with sustainable fashion choices.",
          metaTitle: "Sustainable Fashion Guide | Eco-Friendly Style",
          metaDescription:
            "Complete guide to sustainable fashion and building an eco-friendly wardrobe.",
          language_id: 1,
        },
        {
          title: "دليل شامل للموضة المستدامة",
          subTitle: "كيفية بناء خزانة ملابس صديقة للبيئة",
          description:
            "تعلم كيفية اتخاذ خيارات الموضة المستدامة التي تفيدك والبيئة. اكتشف العلامات التجارية والمواد والممارسات التي تعزز الموضة الأخلاقية.",
          shortDescription: "تعلم كيفية بناء خزانة ملابس صديقة للبيئة بخيارات الموضة المستدامة.",
          metaTitle: "دليل الموضة المستدامة | الأناقة الصديقة للبيئة",
          metaDescription: "دليل شامل للموضة المستدامة وبناء خزانة ملابس صديقة للبيئة.",
          language_id: 2,
        },
      ],
    },
    {
      order: 3,
      slug: "tech-innovations-2024",
      postType: "article",
      isFeatured: true,
      isPublished: true,
      views: 2100,
      startDate: new Date().toISOString(),
      endDate: null,
      content: [
        {
          title: "Top Tech Innovations of 2024",
          subTitle: "Revolutionary Technologies Changing Our World",
          description:
            "From AI breakthroughs to quantum computing, discover the most groundbreaking technological innovations that are reshaping industries and daily life in 2024.",
          shortDescription:
            "Explore the revolutionary technologies that are changing our world in 2024.",
          metaTitle: "Top Tech Innovations 2024 | Technology News",
          metaDescription: "Discover the most groundbreaking technological innovations of 2024.",
          language_id: 1,
        },
        {
          title: "أهم الابتكارات التقنية لعام 2024",
          subTitle: "تقنيات ثورية تغير عالمنا",
          description:
            "من اختراقات الذكاء الاصطناعي إلى الحوسبة الكمية، اكتشف أهم الابتكارات التقنية الرائدة التي تعيد تشكيل الصناعات والحياة اليومية في 2024.",
          shortDescription: "استكشف التقنيات الثورية التي تغير عالمنا في 2024.",
          metaTitle: "أهم الابتكارات التقنية 2024 | أخبار التكنولوجيا",
          metaDescription: "اكتشف أهم الابتكارات التقنية الرائدة لعام 2024.",
          language_id: 2,
        },
      ],
    },
    {
      order: 4,
      slug: "lifestyle-wellness-tips",
      postType: "article",
      isFeatured: false,
      isPublished: true,
      views: 650,
      startDate: new Date().toISOString(),
      endDate: null,
      content: [
        {
          title: "10 Essential Wellness Tips for a Better Life",
          subTitle: "Simple Steps to Improve Your Wellbeing",
          description:
            "Discover practical wellness tips that can transform your daily routine and improve your overall quality of life. From nutrition to mindfulness, we cover it all.",
          shortDescription:
            "Simple and practical wellness tips to improve your daily life and wellbeing.",
          metaTitle: "Wellness Tips | Lifestyle Guide",
          metaDescription:
            "Essential wellness tips for a better life. Improve your wellbeing with our expert advice.",
          language_id: 1,
        },
        {
          title: "10 نصائح صحية أساسية لحياة أفضل",
          subTitle: "خطوات بسيطة لتحسين رفاهيتك",
          description:
            "اكتشف نصائح صحية عملية يمكن أن تحول روتينك اليومي وتحسن جودة حياتك بشكل عام. من التغذية إلى اليقظة الذهنية، نغطي كل شيء.",
          shortDescription: "نصائح صحية بسيطة وعملية لتحسين حياتك اليومية ورفاهيتك.",
          metaTitle: "نصائح صحية | دليل نمط الحياة",
          metaDescription: "نصائح صحية أساسية لحياة أفضل. حسّن رفاهيتك مع نصائحنا الخبيرة.",
          language_id: 2,
        },
      ],
    },
    {
      order: 5,
      slug: "fashion-accessories-guide",
      postType: "article",
      isFeatured: false,
      isPublished: true,
      views: 450,
      startDate: new Date().toISOString(),
      endDate: null,
      content: [
        {
          title: "Ultimate Guide to Fashion Accessories",
          subTitle: "How to Accessorize Like a Pro",
          description:
            "Master the art of accessorizing with our comprehensive guide. Learn how to choose and style accessories that complement your outfits perfectly.",
          shortDescription: "Learn how to accessorize like a professional with our ultimate guide.",
          metaTitle: "Fashion Accessories Guide | Style Tips",
          metaDescription:
            "Ultimate guide to fashion accessories and how to accessorize like a pro.",
          language_id: 1,
        },
        {
          title: "دليل شامل لإكسسوارات الموضة",
          subTitle: "كيفية تنسيق الإكسسوارات كالمحترفين",
          description:
            "أتقن فن تنسيق الإكسسوارات مع دليلنا الشامل. تعلم كيفية اختيار وتنسيق الإكسسوارات التي تكمل ملابسك بشكل مثالي.",
          shortDescription: "تعلم كيفية تنسيق الإكسسوارات كالمحترفين مع دليلنا الشامل.",
          metaTitle: "دليل إكسسوارات الموضة | نصائح الأناقة",
          metaDescription: "دليل شامل لإكسسوارات الموضة وكيفية تنسيقها كالمحترفين.",
          language_id: 2,
        },
      ],
    },
    {
      order: 6,
      slug: "fashion-photography-gallery",
      postType: "gallery",
      isFeatured: true,
      isPublished: true,
      views: 1800,
      startDate: new Date().toISOString(),
      endDate: null,
      featuredImages: getRandomImages(6, 800, 600),
      thumb: getRandomImage(600, 400, 1),
      content: [
        {
          title: "Fashion Photography Gallery",
          subTitle: "Stunning Fashion Photography Collection",
          description:
            "Explore our curated collection of stunning fashion photography featuring the latest trends and styles.",
          shortDescription: "Beautiful fashion photography gallery showcasing latest trends.",
          metaTitle: "Fashion Photography Gallery | Style Collection",
          metaDescription: "Explore our stunning fashion photography gallery with latest trends.",
          language_id: 1,
        },
        {
          title: "معرض تصوير الموضة",
          subTitle: "مجموعة رائعة من تصوير الموضة",
          description:
            "استكشف مجموعتنا المختارة من تصوير الموضة الرائع الذي يعرض أحدث الاتجاهات والأنماط.",
          shortDescription: "معرض تصوير موضة جميل يعرض أحدث الاتجاهات.",
          metaTitle: "معرض تصوير الموضة | مجموعة الأناقة",
          metaDescription: "استكشف معرض تصوير الموضة الرائع مع أحدث الاتجاهات.",
          language_id: 2,
        },
      ],
    },
    {
      order: 7,
      slug: "lifestyle-inspiration-gallery",
      postType: "gallery",
      isFeatured: false,
      isPublished: true,
      views: 950,
      startDate: new Date().toISOString(),
      endDate: null,
      featuredImages: getRandomImages(8, 800, 600),
      thumb: getRandomImage(600, 400, 1),
      content: [
        {
          title: "Lifestyle Inspiration Gallery",
          subTitle: "Beautiful Lifestyle Moments",
          description:
            "Get inspired by our collection of beautiful lifestyle photography showcasing everyday moments and style inspiration.",
          shortDescription: "Beautiful lifestyle gallery with inspiring moments.",
          metaTitle: "Lifestyle Inspiration Gallery | Daily Inspiration",
          metaDescription: "Get inspired by our beautiful lifestyle photography gallery.",
          language_id: 1,
        },
        {
          title: "معرض إلهام نمط الحياة",
          subTitle: "لحظات نمط الحياة الجميلة",
          description:
            "استلهم من مجموعتنا من تصوير نمط الحياة الجميل الذي يعرض اللحظات اليومية وإلهام الأناقة.",
          shortDescription: "معرض نمط حياة جميل مع لحظات ملهمة.",
          metaTitle: "معرض إلهام نمط الحياة | الإلهام اليومي",
          metaDescription: "استلهم من معرض تصوير نمط الحياة الجميل لدينا.",
          language_id: 2,
        },
      ],
    },
    {
      order: 8,
      slug: "product-showcase-gallery",
      postType: "gallery",
      isFeatured: true,
      isPublished: true,
      views: 1200,
      startDate: new Date().toISOString(),
      endDate: null,
      featuredImages: getRandomImages(10, 800, 600),
      thumb: getRandomImage(600, 400, 1),
      content: [
        {
          title: "Product Showcase Gallery",
          subTitle: "Featured Products Collection",
          description:
            "Browse through our stunning product showcase gallery featuring our best and most popular items.",
          shortDescription: "Beautiful product showcase gallery with featured items.",
          metaTitle: "Product Showcase Gallery | Featured Collection",
          metaDescription: "Browse our stunning product showcase gallery with featured items.",
          language_id: 1,
        },
        {
          title: "معرض عرض المنتجات",
          subTitle: "مجموعة المنتجات المميزة",
          description: "تصفح معرض عرض المنتجات الرائع لدينا الذي يعرض أفضل وأشهر منتجاتنا.",
          shortDescription: "معرض عرض منتجات جميل مع منتجات مميزة.",
          metaTitle: "معرض عرض المنتجات | المجموعة المميزة",
          metaDescription: "تصفح معرض عرض المنتجات الرائع لدينا مع منتجات مميزة.",
          language_id: 2,
        },
      ],
    },
  ];

  // Check if blogs already exist
  const existingBlogs = await blogRepository.count();
  if (existingBlogs > 0) {
    console.log(`ℹ️  ${existingBlogs} blogs already exist. Skipping seed.`);
    return;
  }

  // Create blogs
  const blogs: Blog[] = [];
  for (let i = 0; i < blogsData.length; i++) {
    const blogData = blogsData[i];
    const user = users[i % users.length];
    // Assign 1-2 categories to each blog
    const categories = blogCategories.slice(
      i % blogCategories.length,
      (i % blogCategories.length) + 2,
    );
    if (categories.length === 0) {
      categories.push(blogCategories[0]);
    }

    const blog = blogRepository.create({
      ...blogData,
      categories: categories,
      createdBy: user,
    });

    blogs.push(blog);
  }

  // Save all blogs
  await blogRepository.save(blogs);
  console.log(`✅ Successfully seeded ${blogs.length} blogs.`);
}

// Standalone execution
if (require.main === module) {
  import("../../typeorm-cli").then(async ({ connectionSource }) => {
    try {
      await connectionSource.initialize();
      console.log("📦 Starting blog seeder...");
      await seedBlogs(connectionSource);
      await connectionSource.destroy();
      console.log("✅ Blog seeder completed!");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error seeding blogs:", error);
      process.exit(1);
    }
  });
}
