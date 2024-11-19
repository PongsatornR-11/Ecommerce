const prisma = require("../config/prisma");

const cloudinary = require("cloudinary").v2;
//configuration cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_API_SCRET,
});

exports.create = async (req, res) => {
  try {
    // receive data from frontend
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    // console.log(title, description, price, quantity, images)
    const product = await prisma.product.create({
      data: {
        //database : from user (frontend)
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),

        // one to many  >> one product can have many photo
        images: {
          create: images.map((item) => ({
            //database : from user (frontend)
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });

    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.list = async (req, res) => {
  try {
    const { count } = req.params; // from http://localhost:5000/api/products/3  >> 3
    // console.log(`count = ${count}`)
    // console.log(`type of count = ${typeof count}`)

    //get data from database in product table  >> http://localhost:5000/api/products/2
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.read = async (req, res) => {
  try {
    const { id } = req.params; // from http://localhost:5000/api/product/3  >> 3

    //get data from database in product table  >> http://localhost:5000/api/products/2
    const products = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    // receive data from frontend
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    // console.log(title, description, price, quantity, images)

    // clear old images
    await prisma.image.deleteMany({
      where: {
        productId: Number(req.params.id),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        //database : from user (frontend)
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),

        // one to many  >> one product can have many photo
        images: {
          create: images.map((item) => ({
            //database : from user (frontend)
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });

    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // step 1 find product (include images of that product)
    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { images: true },
    });
    if (!product) {
      return res
        .status(400)
        .json({ message: `product id : ${id} doesn't exist!!!` });
    }
    // step 2 use promise for waiting delete images from cloudinary
    const deleteImages = product.images.map(
      (image) =>
        new Promise((resolve, reject) => {
          // delete from cluod
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        }),
    );
    await Promise.all(deleteImages);
    // step 3 delete product
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(`Delete ${product.title} Success!`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.listby = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    console.log(sort, order, limit);
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: {
        category: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// const handleQuery = async(req,res,query) =>{
//     try{
//         const products = await prisma.product.findMany({
//             where:{
//                 //title is column of table product in database
//                 title: {
//                     // contains is where is contain with query
//                     contains: query
//                 }
//             },
//             include:{
//                 category:true,
//                 images:true
//             }
//         })
//         res.send(products)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: "Search error"})
//     }
// }

// const handlePrice = async(req,res,priceRange) =>{
//     try{
//         const products = await prisma.product.findMany({
//             where:{
//                 price:{
//                     // gte >> greater than
//                     gte: priceRange[0],
//                     // lte >> less than or equal
//                     lte: priceRange[1]
//                 }
//             },
//             include:{
//                 category:true,
//                 images: true
//             }
//         })
//         res.send(products)
//     } catch (err){
//         console.log(err)
//         res.status(500).json({ message: "Search price error"})
//     }
// }

// const handleCategory = async(req,res,categoryId) =>{
//     try{
//         const products = await prisma.product.findMany({
//             where:{
//                 categoryId:{
//                     in: categoryId.map((id)=> Number(id))
//                 }
//             },
//             include:{
//                 category:true,
//                 images:true
//             }
//         })
//     res.send(products)
//     }catch(err){
//         console.log(err)
//         res.status(500).json({message : "Search category error"})
//     }
// }

exports.searchFilters = async (req, res) => {
  try {
    const { query, category, price } = req.body;
    if (query) {
      const handleQuery = async (req, res, query) => {
        try {
          const products = await prisma.product.findMany({
            where: {
              //title is column of table product in database
              title: {
                // contains is where is contain with query
                contains: query,
              },
            },
            include: {
              category: true,
              images: true,
            },
          });
          res.send(products);
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Search error" });
        }
      };
      await handleQuery(req, res, query);
    }
    if (category) {
      const handleCategory = async (req, res, categoryId) => {
        try {
          const products = await prisma.product.findMany({
            where: {
              categoryId: {
                in: categoryId.map((id) => Number(id)),
              },
            },
            include: {
              category: true,
              images: true,
            },
          });
          res.send(products);
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Search category error" });
        }
      };
      await handleCategory(req, res, category);
    }
    if (price) {
      const handlePrice = async (req, res, priceRange) => {
        try {
          const products = await prisma.product.findMany({
            where: {
              price: {
                // gte >> greater than
                gte: priceRange[0],
                // lte >> less than or equal
                lte: priceRange[1],
              },
            },
            include: {
              category: true,
              images: true,
            },
          });
          res.send(products);
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "Search price error" });
        }
      };
      await handlePrice(req, res, price);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `WomenOn${Date.now()}`,
      resource_type: "auto",
      folder: "Ecom",
    });
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    await cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Image Removed");
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
