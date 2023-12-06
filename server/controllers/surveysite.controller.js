import SurveySite from '../models/surveysite.model'
import { extend } from 'lodash'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'

const create = (req,res) =>{
    console.log("no create");
    let form = new formidable.IncomingForm()
    form.keepExtension = true
    form.parse(req, async(err,fields,files)=>{
        if(err){
            res.status(400).json({
                message:"Image could not be uploaded"
            })
        }
        let surveySite = new SurveySite(fields)
        surveySite.owner = req.profile
        if(files.image){
            surveySite.image.data = fs.readFileSync(files.image.path)
            surveySite.image.contentType = files.image.type
        }
        try{
            let result = await surveySite.save()
            res.status(200).json(result)
        }catch(err){
            return res.status(400).json({
                error:errorHandler.getErrorMessage(err)
            })
        }
    })
}

const surveySiteById = async(req,res,next,id) =>{
    try{
        let surveySite = await SurveySite.findById(id).populate('owner','_id name').exec()
        if(!surveySite)
        return res.status('400').json({
            error:"Survey site not found"
    })
    req.surveySite = surveySite
    next()
    }catch(err){
        return res.status('400').json({
            error: "Could not retrieved survey site"
        })
    }
}

const photo = (req,res,next) =>{
    if(req.surveySite.image.data){
        res.set("Content-Type",req.surveySite.image.contentType)
        return res.send(req.surveySite.image.data)
    }
    next()
}

const defaultPhoto = (req,res)=>{
    return null
}

const read = (req,res) => {
    req.surveySite.image = undefined
    return res.json(req.surveySite)
}

const update = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtension = true
    form.parse(req, async(err,fields,files)=>{
        if(err){
            res.status(400).json({
                message:"Image could not be uploaded"
            })
        }
        let surveySite = req.surveySite
        surveySite.updated = Date.now()
        if(files.image){
            surveySite.image.data = fs.readFileSync(files.image.path)
            surveySite.image.contentType = files.image.type
        }
        try{
            let result = await surveySite.save()
            res.json(result)
        }catch(err){
            return res.status(400).json({
                error:errorHandler.getErrorMessage(err)
            })
        }
    })
}

const remove = async(req,res) =>{
    try{
        let surveySite = req.surveySite
        let deletedSurveySite = surveySite.remove()
        res.json(deletedSurveySite)
    }catch(err){
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const list = async(req,res) =>{
    try{
        let surveySite = await SurveySite.find()
        res.json(surveySite)
    }catch(err){
        return res.status(400).json({
            error : errorHandler.getErrorMessage(err)
        })
    }
}

const listByOwner = async(req,res) =>{
    try{
        let surveySite = await SurveySite.find({owner:req.profile._id}).populate('owner','_id name')
        res.json(surveySite)
    }catch(err){
        return res.status(400).json({
            error : errorHandler.getErrorMessage(err)
        })
    }
}

const isProvider = (req,res,next) => {
    const isProvider = req.surveySite && req.surveySite.owner._id == req.auth._id
    if(!isProvider){
        return res.status('403').json({
            error : "User is not authorized"
        })
    }
    next()
}

export default {
    create,
    surveySiteById,
    photo,
    defaultPhoto,
    list,
    listByOwner,
    read,
    update,
    isProvider,
    remove
}