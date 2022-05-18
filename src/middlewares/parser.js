const express = require('express')
var multer = require('multer');
var forms = multer();

module.exports = express().use(forms.array())