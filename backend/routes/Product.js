const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Warehouse = require('../models/warehouse');
const multer = require('multer');
const path = require('path');
const ProductCategories = require('../models/productCategories');
const Worker = require('../models/worker');

const getOneProductCategories = async (category) => { 
    const oneProductCategories = await ProductCategories.findOne({id : category});
    return oneProductCategories
}

router.get('/', async (req, res)=>{
  const products = await Product.find();
  res.status(201).json(products)
});


router.get('/byWarehouse/:warehouseId', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    const products = await Product.find({ warehouseId });

    const enriched = await Promise.all(
      products.map(async (product) => {
        const category = await ProductCategories.findOne({ id: product.categoryId });
        return {
          ...product._doc,
          categoryName: category ? category.categoriesName : "(Kategori tidak ditemukan)"
        };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Error fetching products by warehouse:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/getAllProductMainWarehouse', async (req, res)=>{
    const mainWarehouse = await Warehouse.find({main : 0 })
    const products = await Product.find({ warehouseId : mainWarehouse[0].id});
    res.status(201).json(products)
});

// 🔁 POST /product/convertUnit
router.put('/convertByUser/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, price } = req.body;
  const { username } = req.query;

  if (!amount || amount < 1) {
    return res.status(400).json({ error: 'Invalid amount to convert' });
  }

  try {
    // Step 1: Get warehouse via worker
    const worker = await Worker.findOne({ username });
    if (!worker || !worker.warehouseId) {
      return res.status(404).json({ error: 'Worker not found or no warehouse assigned' });
    }

    // Step 2: Get the correct product
    const product = await Product.findOne({ id, warehouseId: worker.warehouseId });
    if (!product) return res.status(404).json({ error: 'Product not found for this worker' });

    const category = await ProductCategories.findOne({ id: product.categoryId });
    if (!category || category.unitConversion === "-" || !category.conversionRate) {
      return res.status(400).json({ error: 'This product category is not convertible' });
    }

    if (product.stock < amount) {
      return res.status(400).json({ error: 'Not enough stock to convert' });
    }

    // Step 3: Convert
    product.stock -= amount;
    await product.save();

    const convertedId = `${product.id}-${category.unitConversion.toLowerCase()}`;
    const convertedName = `${product.name} - ${category.unitConversion}`;
    const convertedQty = amount * parseInt(category.conversionRate);
    const calculatedPrice = Math.floor(product.price / parseInt(category.conversionRate));

    const existingConverted = await Product.findOne({
      id: convertedId,
      warehouseId: product.warehouseId
    });

    if (existingConverted) {
      existingConverted.stock += convertedQty;
      existingConverted.lastUpdate = new Date();
      await existingConverted.save();
    } else {
      const newProduct = new Product({
        id: convertedId,
        name: convertedName,
        stock: convertedQty,
        categoryId: product.categoryId,
        unit: category.unitConversion,
        unitConversion: "-",
        price: price || calculatedPrice,
        description: product.description,
        warehouseId: product.warehouseId,
        lastUpdate: new Date(),
        status: 1,
        reason: "Converted from " + product.unit,
        updatedBy: "system",
        imageUrl: product.imageUrl
      });
      await newProduct.save();
    }

    res.status(200).json({ message: 'Conversion successful' });
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/new', async (req, res) => {
  try {
    const { name, stock, category, price, description, status, warehouseId } = req.body;
    const temp = await getOneProductCategories(category);

    const now = new Date();
    const pad = (n, width) => n.toString().padStart(width, '0');
    const id = `P${now.getFullYear()}${pad(now.getMonth()+1,2)}${pad(now.getDate(),2)}${pad(now.getHours(),2)}${pad(now.getMinutes(),2)}${pad(now.getSeconds(),2)}${pad(now.getMilliseconds(),3)}`;
    
    const unit = temp.unit;
    const unitConversion = temp.unitConversion;
    const lastUpdate = new Date();

    const newProduct = new Product({
      id,
      name,
      stock,
      categoryId: category,
      unit,
      unitConversion,
      price,
      description,
      warehouseId,
      lastUpdate,
      status,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating Product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/stockOpname', async (req, res)=>{
    const {data , user } = req.body

    // const bulkOperations = updates
    // .filter(data => data.newStock !== "" && data.newStock !== null && data.newStock !== undefined)
    // .map(data => ({
    //     updateOne: {
    //     filter: { _id: data.id }, // Match document by `_id`
    //     update: { $set: { stock: data.newStock } } // Update the `stock` field
    //     }
    // }));

    const lastUpdate = new Date();
    const bulkOperations = data.map(data => ({
        updateMany: {
          filter: { id: data.id }, // Match document by `_id` (or `id` depending on your schema)
          update: { $set: 
            {   stock: data.newStock,
                reason : data.newReason,
                updatedBy : user,
                lastUpdate: lastUpdate
           } }, // Update the `stock` field
        }
      }));


    Product.bulkWrite(bulkOperations)
    .then(result => {
        console.log('Bulk update success:', result);
    })
    .catch(error => {
        console.error('Bulk update error:', error);
    });
});

router.get('/get/:id', async (req, res)=>{
    const oneProduct = await Product.findOne({id : req.params.id});
    res.status(201).json({data : oneProduct})
});

router.get('/getOneProductMainWarehouse/:id', async (req, res)=>{
    const mainWarehouse = await Warehouse.find({main : 0 })
    const oneProduct = await Product.findOne({id : req.params.id ,warehouseId : mainWarehouse[0].id });
    res.status(201).json({data : oneProduct})
});

router.put('/updateStatusByUser/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { updateStatus } = req.body;
    const { username } = req.query;

    // Get warehouse from worker
    const worker = await Worker.findOne({ username });
    if (!worker || !worker.warehouseId) {
      return res.status(404).json({ error: 'Worker not found or has no warehouse' });
    }

    // Flip status
    const newStatus = updateStatus == 1 ? 0 : 1;

    const updated = await Product.findOneAndUpdate(
      { id, warehouseId: worker.warehouseId },
      { $set: { status: newStatus } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Product not found for this worker' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/restockByUser/:id', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  const { username } = req.query;

  try {
    // Step 1: Find worker
    const worker = await Worker.findOne({ username });
    if (!worker || !worker.warehouseId) {
      return res.status(404).json({ message: "Worker not found or no warehouse assigned" });
    }

    // Step 2: Find correct product
    const product = await Product.findOne({ id, warehouseId: worker.warehouseId });
    if (!product) return res.status(404).json({ message: "Product not found for this worker" });

    const newStock = product.stock + parseInt(stock);

    const updated = await Product.findOneAndUpdate(
      { id, warehouseId: worker.warehouseId },
      { $set: { stock: newStock } },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error("Restock error:", err);
    res.status(500).json({ message: "Error updating stock", error: err });
  }
});


router.put('/updateDescByUser/:id', async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const { username } = req.query;

  try {
    // Step 1: Get warehouse via worker
    const worker = await Worker.findOne({ username });
    if (!worker || !worker.warehouseId) {
      return res.status(404).json({ message: "Worker not found or no warehouse assigned" });
    }

    // Step 2: Update description scoped to warehouse
    const updated = await Product.findOneAndUpdate(
      { id, warehouseId: worker.warehouseId },
      { $set: { description } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found for this worker" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update description error:", err);
    res.status(500).json({ message: "Error updating description", error: err });
  }
});




// Upload product image and update imageUrl
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const { productId } = req.body;

    if (!req.file || !productId) {
      return res.status(400).json({ message: 'Image and productId required' });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;

    await Product.findOneAndUpdate(
      { id: productId },
      { imageUrl: imageUrl }
    );

    res.status(200).json({ message: 'Image uploaded and product updated', imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getByIdAndUser', async (req, res) => {
  try {
    const { id, username } = req.query;
    console.log("masuk get by id and user")
    const worker = await Worker.findOne({ username });
    if (!worker || !worker.warehouseId) {
      return res.status(404).json({ error: 'Worker not found or has no assigned warehouse' });
    }

    const product = await Product.findOne({ id, warehouseId: worker.warehouseId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found in user\'s warehouse' });
    }

    res.status(200).json({ data: product });
  } catch (err) {
    console.error("Error in getByIdAndUser:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;