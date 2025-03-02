const express = require('express');
const router = express.Router();
const Move = require('../models/move');
const MoveProduct = require('../models/moveProduct');
const Worker = require('../models/worker');
const Product = require('../models/product');

router.get('/', async (req, res)=>{
  const moves = await Move.find();
  res.status(201).json(moves)
});

router.post('/new', async (req, res)=>{
    try {
        const { requester,product,quantity } = req.body;

        const oneWorker = await Worker.findOne({username : requester});
        const to = oneWorker.warehouseId
        const from = "W01"

        const move = await Move.find();
        const length = move.length +1;
        const id = "M0"+length


        const moveProduct = await MoveProduct.find()
        const lengthMP = moveProduct.length +1;
        const idMP = "MP0"+lengthMP

        const approver = "belum ada";
        const status = 0;
        const newMove = new Move({
            id,
            requester,
            approver,
            from,
            to,
            status
        });
        await newMove.save();
        
        const newMoveProduct = new MoveProduct({
            id : idMP,
            moveId : id,
            productId : product,
            quantity : quantity
        });
        await newMoveProduct.save();

        res.status(201).json({ message: 'move created successfully', move: newMove });
    } catch (error) {
        console.error('Error creating Address:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get/:id', async (req, res)=>{
    const oneMove = await Move.findOne({id : req.params.id});
    res.status(201).json({data : oneMove})
});

router.get('/getMoveProduct/:id', async (req, res)=>{
    const oneMoveProduct = await MoveProduct.findOne({moveId : req.params.id});
    res.status(201).json({data : oneMoveProduct})
});

router.put('/updateMove/:id', async (req, res)=>{
    const  {id}  = req.params; 
    const {updateStatus,approver} = req.body; 

    let newStatus = updateStatus+1


    if (updateStatus+1  <3){
        const updateMove = await Move.findOneAndUpdate(
            {id: id},           
            { $set: {status : newStatus,
                approver : approver
            } },
            { new: true }
        );
        res.status(200).json(updateMove);
    }else{

        const updateMove = await Move.findOneAndUpdate(
            {id: id},           
            { $set: {status : newStatus,
                approver : approver
            } },
            { new: true }
        );

        const oneMoveProduct = await MoveProduct.findOne({moveId : req.params.id});
        const oneMove = await Move.findOne({id : req.params.id});
        const oneProduct = await Product.findOne({id : oneMoveProduct.productId});
        const idProduct = oneProduct.id
        const nameProduct = oneProduct.name
        const quantityProduct = oneMoveProduct.quantity
        const categoryProduct = oneProduct.category
        const unitProduct = oneProduct.unit
        const unitConversionProdcut = oneProduct.unitConversion
        const priceProduct = oneProduct.price
        const descriptionProduct = oneProduct.description
        const warehouseIdProduct = oneMove.to
        const statusProduct = oneProduct.status
        const lastUpdateProduct = new Date()
        const reasonProduct = ""
        const updatedBy = ""
        
        const newProduct = new Product({
            id : idProduct,
            name : nameProduct,
            stock: quantityProduct,
            category: categoryProduct,
            unit: unitProduct,
            unitCoversion: unitConversionProdcut,
            price: priceProduct,
            description: descriptionProduct,
            warehouseId: warehouseIdProduct,
            status: statusProduct,
            lastUpdate: lastUpdateProduct,
            reason: reasonProduct,
            updatedBy: updatedBy
        });
        console.log(newProduct)
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    }

    
});

module.exports = router;