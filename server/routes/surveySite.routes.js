import express from "express";
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'
import surveySiteCtrl from '../controllers/surveysite.controller.js'

const router = express.Router()

router.route('/api/surveySites').get(surveySiteCtrl.list)

router.route('/api/surveySite/:surveySiteId').get(surveySiteCtrl.read)

router.route('/api/surveySites/by/:userId')
    .post(authCtrl.requireSignin,authCtrl.hasAuthorization,userCtrl.isProvider,surveySiteCtrl.create)
    .get(authCtrl.requireSignin,authCtrl.hasAuthorization,surveySiteCtrl.listByOwner)

router.route('/api/surveySites/:surveySiteId')
    .put(authCtrl.requireSignin,surveySiteCtrl.isProvider,surveySiteCtrl.update)
    .delete(authCtrl.requireSignin,surveySiteCtrl.isProvider,surveySiteCtrl.remove)

router.route('/api/surveySites/logo/:surveySiteId').get(surveySiteCtrl.photo,surveySiteCtrl.defaultPhoto)

router.route('/api/surveySites/defaultphoto').get(surveySiteCtrl.defaultPhoto)

router.param('surveySiteId',surveySiteCtrl.surveySiteById)
router.param('userId',userCtrl.userByID)

export default router