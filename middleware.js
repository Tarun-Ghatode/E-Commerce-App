const Product = require("./models/Product");
const { productSchema } = require("./schema");
const { reviewSchema } = require("./schema");

const validateProduct = (req,res,next)=>{
    const {name, img, price , desc} = req.body;
    const {error} = productSchema.validate({name,img,price,desc});
    
    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    next();
}

const validateReview = (req,res,next)=>{

    const {rating, comment} = req.body;
    const {error} = reviewSchema.validate({rating,comment});

    if(error){
        const msg = error.details.map((err)=>err.message).join(',');
        return res.render('error' , {err:msg});
    }
    next();
}

const isLoggedIn = (req, res, next)=>{

    // console.log(req.xhr); // ajax hai ya nhi hai

    if(req.xhr && !req.isAuthenticated()){
        return res.status(401).send('unauthorised');

        //****OR*******

        // return res.error({msg : "you need to login first"});


        // console.log(req.xhr);//ajax hai ya nhi hai?

        // return res.redirect('/login');
    } 

    if(!req.isAuthenticated()){
        req.flash('error', 'You need to login first');
        return res.redirect('/login');
    }
    next();
}

const isSeller = (req, res, next)=>{
    let {id} = req.params;
    if(!req.user.role){
        req.flash('error', 'you donot have the Permission');
        return res.redirect('/products');
    } else if(req.user.role !== "Seller"){
        req.flash('error', 'you donot have the Permission');
        return res.redirect(`/products/${id}`)
    }
    next();

}

const isProductAuthor = async(req,res,next)=>{
    let {id} = req.params;
    let product = await Product.findById(id);
    
    console.log(product.author , 'author'); //objectid
    console.log(req.user , 'user'); //objectid
    
    if(!product.author.equals(req.user._id)){
        req.flash('error' , 'You are not the owner of this product');
        return res.redirect(`/products/${id}`)
    }
    next();
}


module.exports = {validateProduct ,validateReview, isLoggedIn, isSeller , isProductAuthor} ;