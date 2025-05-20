const { Product } = require("../models");
const QRCode = require("qrcode");
const { Op } = require("sequelize");
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class MainController {
  async generateQRCode(req, res) {
    try {
      const { productId } = req.body;
      const product = await Product.findByPk(productId);
      console.log("product is here: ", product);
      if (!product || !product.qr_text) {
        throw new Error("Text not provided.");
      }
      const qrCode = await QRCode.toDataURL(product.qr_text);
      res.render("products/qrcode", { qrCode, product });
    } catch (error) {
      console.error("Error generating QR code:", error);
      req.flash("error", error.message);
      res.redirect("/");
    }
  }
  
  async index(req, res) {
    try {
      const products = await Product.findAll();
      res.render("index", { products });
    } catch (error) {
      console.error("Error fetching products:", error);
      req.flash("error", error.message);
    }
  }
  
  async create(req, res) {
    try {
      res.render("products/create");
    } catch (error) {
      console.error("Error rendering create form:", error);
      req.flash("error", error.message);
      res.redirect("/");
    }
  }

  async store(req, res) {
    try {
      const { name, description, sku, price, qr_text } = req.body;
      const newProduct = await Product.create({
        name,
        description,
        sku,
        price,
        qr_text,
      });
      req.flash("success", "Product created successfully!");
      res.redirect("/");
    } catch (error) {
      console.error("Error creating product:", error);
      req.flash("error", error.message);
      res.redirect("/");
    }
  }
  
  async edit(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        req.flash("error", "Product not found.");
        return res.redirect("/");
      }
      res.render("products/edit", { product });
    } catch (error) {
      console.error("Error fetching product for edit:", error);
      req.flash("error", error.message);
      res.redirect("/");
    }
  }
  
  async update(req, res) {
    try {
      const { name, description, sku, price, qr_text } = req.body;
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        req.flash("error", "Product not found.");
        return res.redirect("/");
      }
      await product.update({ name, description, sku, price, qr_text });
      req.flash("success", "Product updated successfully!");
      res.redirect("/");
    } catch (error) {
      console.error("Error updating product:", error);
      req.flash("error", error.message);
      res.redirect("/");
    }
  }

  async delete(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        req.flash("error", "Product not found.");
        return res.redirect("/");
      }
      await product.destroy();
      req.flash("success", "Product deleted successfully!");
      res.redirect("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      req.flash("error", error.message);
      res.redirect("/");
    }
  }

  async search(req, res) {
    try {
      const productId = req.body.sku;
      // console.log("Starting product search...");
      // console.log("SKU received:", productId);

      const product = await Product.findOne({
        where: {
          [Op.or]: [{ sku: productId }, { id: productId }],
        },
      });

      // console.log(
      //   "Search result:",
      //   product
      //     ? {
      //         id: product.id,
      //         sku: product.sku,
      //         name: product.name,
      //       }
      //     : "Product not found"
      // );

      if (!product) {
        req.flash("error", `Product with SKU/ID ${productId} not found.`);
        return res.redirect("/");
      }

      return res.render("products/show", {
        product,
        messages: req.flash(),
      });
    } catch (error) {
      console.error("Error searching for product:", error);
      req.flash("error", "Error searching for product: " + error.message);
      return res.redirect("/");
    }
  }

  async importExcel(req, res) {
    try {
      if (!req.file) {
        req.flash('error', 'Please upload an Excel file');
        return res.redirect('/');
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(req.file.path);

      const worksheet = workbook.worksheets[0]; 
      const products = [];

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;

        const [
          name,
          description,
          sku,
          price,
          qr_text
        ] = row.values.slice(1); // remove first empty value (index 0)

        products.push({
          name,
          description,
          sku,
          price,
          qr_text: qr_text || sku
        });
      });

      const duplicateSKUs = [];
      let importedCount = 0;

      for (const product of products) {
        const existingProduct = await Product.findOne({
          where: { sku: product.sku }
        });

        if (existingProduct) {
          duplicateSKUs.push(product.sku);
          continue;
        }

        await Product.create(product);
        importedCount++;
      }

      if (importedCount > 0) {
        req.flash('success', `${importedCount} products imported successfully`);
      }

      if (duplicateSKUs.length > 0) {
        req.flash(
          'warning',
          `The following SKUs were skipped (already exist): ${duplicateSKUs.join(', ')}`
        );
      }

      fs.unlinkSync(req.file.path);

      return res.redirect('/');

    } catch (error) {
      console.error('Error importing Excel:', error);
      req.flash('error', 'Error importing products: ' + error.message);

      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      return res.redirect('/');
    }
  }
}

module.exports = new MainController();
