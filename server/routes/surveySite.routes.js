import express from "express";
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import surveySiteCtrl from '../controllers/surveysite.controller'

const router = express.Router()

router.route('/api/surveySite').get(surveySiteCtrl.list)

router.route('/api/surveySite/:surveySiteId').get(surveySiteCtrl.read)

router.route('/api/surveySite/by/:userId')
    .post(authCtrl.requireSignin,authCtrl.hasAuthorization,userCtrl.isProvider,surveySiteCtrl.create)
    .get(authCtrl.requireSignin,authCtrl.hasAuthorization,surveySiteCtrl.listByOwner)

router.route('/api/surveySite/:surveySiteId')
    .put(authCtrl.requireSignin,surveySiteCtrl.isProvider,surveySiteCtrl.update)
    .delete(authCtrl.requireSignin,surveySiteCtrl.isProvider,surveySiteCtrl.remove)

router.route('/api/surveySite/logo/:surveySiteId').get(surveySiteCtrl.photo,surveySiteCtrl.defaultPhoto)

router.route('/api/surveySite/defaultphoto').get(surveySiteCtrl.defaultPhoto)

router.param('surveySiteId',surveySiteCtrl.surveySiteById)
router.param('userId',userCtrl.userByID)

export default router