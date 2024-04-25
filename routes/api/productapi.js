const express =  require('express');
const { isLoggedIn } = require('../../middleware');
const router = express.Router();
const User = require('../../models/User');

router.post('/products/:productId/like', isLoggedIn, async (req,res)=>{
    // console.log(req.params.id);
    // res.send(req.params.id);

    let {productId} = req.params;

    let user = req.user;
    let isLiked = user.wishlist.includes(productId);
    // console.log(isLiked);

    if(isLiked){
        await User.findByIdAndUpdate(req.user._id , {$pull: {wishlist : productId}})
    }else{
        await User.findByIdAndUpdate(req.user._id , {$addToSet: {wishlist : productId}})
    }    

})

module.exports = router;