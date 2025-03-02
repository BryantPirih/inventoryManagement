const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const ProductCategories = require('../models/productCategories');

const getOneProductCategories = async (category) => { 
    const oneProductCategories = await ProductCategories.findOne({categoriesName : category});
    return oneProductCategories
}


router.get('/', async (req, res)=>{
  const products = await Product.find();
  res.status(201).json(products)
});

router.post('/new', async (req, res)=>{
    try {
        const { name, stock, category, price, description, status,warehouseId} = req.body;
        const temp = await getOneProductCategories(category)
        const id = name.substring(0,1) + "01"
        const unit = temp.unit
        const unitConversion = temp.unitConversion
        const lastUpdate = new Date()
        const newProduct = new Product({
            id,
            name,
            stock,
            category,
            unit,
            unitConversion,
            price,
            description,
            warehouseId,
            lastUpdate,
            status
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        // Handle errors
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

router.put('/updateStatusProduct/:id', async (req, res)=>{
    const  {id}  = req.params; 
    const {updateStatus} = req.body; 
    let newStatus = 0;

    console.log(id)
    console.log(updateStatus)

    if(updateStatus == 1 ){
        newStatus = 0;
    }
    else{
        newStatus = 1;
    }

    const updateStatusProduct = await Product.findOneAndUpdate(
        {id: id},           
        { $set: {status : newStatus} },
        { new: true }
    );

    res.status(200).json(updateStatusProduct);
});

router.put('/updateProduct/:id', async (req, res)=>{
    const  {id}  = req.params; 
    const {newStock,newDescription} = req.body; 
    const updateProduct = await Product.findOneAndUpdate(
        {id: id},           
        { $set: {stock : newStock,
            description : newDescription
        } },
        { new: true }
    );

    res.status(200).json(updateProduct);
});



module.exports = router;