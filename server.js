const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const path = require('path')
const Product = require('./back/modelschema');
const cloudinary = require('cloudinary')
const formidable = require('formidable');
const fs = require('fs');

const app = express();
const PORT = 3000;

cloudinary.config({ 
  cloud_name: 'dxsbqj6z1', 
  api_key: '126648962619959', 
  api_secret: 'xQreV9uE75MKIEG3HGz7ve0sP1Q' 
});

const destFolder = "monitors";
const options = {
  use_filename: true,
  overwrite: false,
  folder: destFolder
};

const mongoDB = "mongodb+srv://db_user:dIwFUTTmvkTei4yK@cluster0.qbru6uc.mongodb.net/monitors?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("З'єднання з БД встановлено");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.static(__dirname + '/public'));

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`Сервер запущено на порту ${PORT}`);
});

app.get("/products", (req, res) => {
  Product.find({})
    .then((products) => {
      return res.send(products);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Помилка при отриманні продуктів");
    });
});

app.delete("/products/:id", (req, res) => {
  const productId = req.params.id;

  Product.findByIdAndRemove(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).send("Продукт не знайдено");
      }

      cloudinary.uploader.destroy(product.cloudinaryPublicId, { invalidate: true }, (error, result) => {
        if (error) {
          console.log(error);
        }
      });

      res.send("Продукт успішно видалено");
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Помилка при видаленні продукту");
    });
});

app.post("/products", (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir: __dirname + '/uploads'
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("Error parsing the files");
      return res.status(400).json({
        status: "Fail",
        message: "There was an error parsing the files",
        error: err,
      });
    }

    const { productId, productName, productDiagonal, productMatrix, productFormat, productInterf, oldCloudinaryPublicId, oldImagePath } = fields;
    const { productImage } = files;

    const productInfo = {
      productName,
      productDiagonal,
      productMatrix,
      productFormat,
      productInterf,
    };

    if (!productImage.originalFilename) {
      productInfo.productImage = oldImagePath;
      productInfo.cloudinaryPublicId = oldCloudinaryPublicId;
      saveDataToDB(productId, productInfo, res);
    } else {
      const getImagePath = productImage.filepath;
      cloudinary.uploader.upload(getImagePath, options)
        .then(image => {
          fs.unlink(getImagePath, (err) => {
            if (err) {
              console.error(err);
            }
          });
          productInfo.productImage = image.url;
          productInfo.cloudinaryPublicId = image.public_id;
          saveDataToDB(productId, productInfo, res);
          cloudinary.uploader.destroy(oldCloudinaryPublicId);
        })
        .catch(err => {
          console.warn(err);
        })
    }
  });
});

router.get("/list", (req, res) => {
  Product.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.warn('Error in retrieving product list:', err);
    }
  });
});

router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  cloudinary.uploader.destroy(req.body.cloudinaryPublicId);
  Product.findByIdAndDelete(productId, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.sendStatus(200);
    }
  });
});

function saveDataToDB(productId, data, res) {
  if (productId == "") {
    Product.create(data)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Помилка при збереженні продукту");
      });
  } else {
    Product.findByIdAndUpdate(productId, data)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Помилка при оновленні продукту");
      });
  }
}

app.use("/products", router);

module.exports = router;
