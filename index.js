const axios = require("axios");
const fs = require("fs");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

const fetchData = async () => {
  const res = await axios.get(
    "https://www.fnp.com/all-cakes-lp?promo=redirectionsearch"
  );

  fs.writeFileSync("data.txt", res.data);
};
fetchData();

const readFile = () => {
  try {
    const data = fs.readFileSync("data.txt", "utf8");
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const $ = cheerio.load(readFile());
console.log($);
const productDetailsArray = [];
const products = $(".jss18")
  .find(".products")
  .each((index, elem) => {
    const productName = $(elem)
      .find(".product-card_product-title__32LFp")
      .text();
    const productPrice = $(elem)
      .find(".product-card_product-desc-tile__10UVW")
      .find(".product-card_product-price-info-container__E9rQf")
      .find(".product-card_product-price-info__17tj7")
      .text();
    const productRating = $(elem)
      .find(".product-card_rating-sec__34VZH")
      .text();

    const productDetails = {
      name: productName,
      price: productPrice,
      rating: productRating.slice(0, 3),
    };

    productDetailsArray.push(productDetails);
  });

const workBook = xlsx.utils.book_new();
const workSheet = xlsx.utils.json_to_sheet(productDetailsArray);

xlsx.utils.book_append_sheet(workBook, workSheet, "sheet1");
xlsx.writeFile(workBook, "data.xlsx");
