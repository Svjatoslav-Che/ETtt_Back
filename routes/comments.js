const express = require('express');
const router = express.Router();

const dbConfig = require('../config/db');
const ModelsLoader = require('../data');

const models = ModelsLoader.getInstance(dbConfig).db;

router.get('/', async (req, res, next) => {
  const result = await models.comments.findAll({
    order: [['id', 'DESC'],],
  });

  return res.json({result});
});

router.post('/', async (req, res, next) => {
  try {
    const result = await models.comments.create(req.body);

    return res.json({result});
  } catch (e) {
    console.log(e);

    return res.status(400).json({error: 'Failed to create'});
  }
});

router.put('/', async (req, res, next) => {
  const {id, commentText} = req.body;

  const result = await models.comments.update({commentText}, {where: {id}});

  return res.json({result});
});
router.delete('/', async (req, res, next) => {
  const {id} = req.body;

  const result = await models.comments.destroy({where: {id}});

  return res.json({result});
});


router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  const result = await models.comments.findAll({ where: { parentId: id } });

  return res.json({ result });
});

router.post('/:id/positive', async (req, res, next) => {
  const {id} = req.params;

  const result = await models.comments.update({assessment: models.sequelize.literal('assessment + 1')}, {where: {id}});

  return res.json({result});
});

router.post('/:id/negative', async (req, res, next) => {
  const {id} = req.params;

  const result = await models.comments.update({assessment: models.Sequelize.literal('assessment - 1')}, {where: {id}});

  return res.json({result});
});

module.exports = router;
