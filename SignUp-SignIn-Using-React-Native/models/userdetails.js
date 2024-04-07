const mongoose = require('mongoose');
const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required:true,
        minlength: [2, 'Name must be at least 2 characters long'], // Minimum length validation
        maxlength: [50, 'Name cannot exceed 50 characters'] // Maximum length validation
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    mobilenumber:{
        type: String,
        unique:true,
    },
    age:{
        type:String,
        required:true
    },
    belongsto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports = mongoose.model('Userdetail', userSchema);