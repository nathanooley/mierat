/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/visitors              ->  index
 * POST    /api/visitors              ->  create
 * GET     /api/visitors/:id          ->  show
 * PUT     /api/visitors/:id          ->  upsert
 * PATCH   /api/visitors/:id          ->  patch
 * DELETE  /api/visitors/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import { Visitor } from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      _.extend(entity, patches);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Visitors
export function index(req, res) {
  return Visitor.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Visitor from the DB
export function show(req, res) {
  return Visitor.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Visitor in the DB
export function create(req, res) {
  return Visitor.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Visitor in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }

  return Visitor.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Visitor in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Visitor.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Visitor from the DB
export function destroy(req, res) {
  return Visitor.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
